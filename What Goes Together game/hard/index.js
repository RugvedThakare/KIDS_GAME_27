var firebaseConfig = {
  apiKey: "AIzaSyDpUeNE5pRN0EOIK5FowkjcSNJAaWmk1Wk",
  authDomain: "kids-game3.firebaseapp.com",
  projectId: "kids-game3",
  storageBucket: "kids-game3.appspot.com",
  messagingSenderId: "121776028608",
  appId: "1:121776028608:web:902e46aa5374d6a35f6625",
  measurementId: "G-0YQMHQF4MV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database
var database = firebase.database();

const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

document.querySelector(".score").textContent = score;

fetch("./cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data];
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  //score--;
  //document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
  isMatch ? score += 10 : score -= 1;
  document.querySelector(".score").textContent = score;
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
}

function saveScore() {

  hideNameModal2();
  let playerName = document.getElementById('userNameInput').value;
  let age = document.getElementById('userAgeInput').value;

          // Get a reference to the 'scores' node in the database
          var scoresRef = database.ref('What Goes Together - Hard');

          // Push a new score to the 'scores' node
          scoresRef.push({
              playerName: playerName,
              age: age,
              score: score
          });
          showNameModal3();
      
  restart();
}

function showNameModal1() {
  var overlay = document.getElementById('overlay1');
  overlay.style.display = 'flex';
}

function showNameModal2() {
  document.getElementById('overlay1').style.display = 'none';
  var kid = document.getElementById('userNameInput').value;
  document.getElementById('kidname').innerHTML = "Hi " + kid + ", may I know your age?";
  var overlay = document.getElementById('overlay2');
  overlay.style.display = 'flex';
}

function showNameModal3() {
  var overlay = document.getElementById('overlay3');
  overlay.style.display = 'flex';
}

function hideNameModal2() {
  var overlay = document.getElementById('overlay2');
  overlay.style.display = 'none';
}

function hideNameModal3() {
  var overlay = document.getElementById('overlay3');
  overlay.style.display = 'none';
}

function togglePlayPause() {
  const backgroundMusic = document.getElementById('backgroundMusic');
  const playPauseSymbol = document.getElementById('playPauseSymbol');

  if (backgroundMusic.paused) {
    // If currently paused, play and change symbol to ⏸ (pause)
    backgroundMusic.play();
    playPauseSymbol.textContent = '⏸';
  } else {
    // If currently playing, pause and change symbol to ▶️ (play)
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    playPauseSymbol.textContent = '▶️';
  }
}