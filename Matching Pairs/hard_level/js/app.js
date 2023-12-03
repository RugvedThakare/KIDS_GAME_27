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

  console.log("Database reference:", database);

// Create a list that holds all of your cards
let cardImages = ['./cardImg/jerry.jpg' , './cardImg/tom.jpg' , './cardImg/bheem.jpg', './cardImg/oggy.jpg' ,'./cardImg/pikachu.jpg' ,'./cardImg/doremon.jpg' , './cardImg/shinchan.jpg' , './cardImg/motu.jpg' ,'./cardImg/jerry.jpg' , './cardImg/tom.jpg' , './cardImg/bheem.jpg', './cardImg/oggy.jpg' ,'./cardImg/pikachu.jpg' ,'./cardImg/doremon.jpg' , './cardImg/shinchan.jpg' , './cardImg/motu.jpg']
let visibleCard;
let firstCard;
let secondCard;
let matchCardnumber = 0;
let movescount = 0;
let stars = [document.querySelectorAll('.fa-star')];
let ratingvalue = 0;
let timercount = new Timer();



function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function generateGameBoard() {
    let cardItemList = shuffle(cardImages);

    cardItemList.forEach(function (imagePath, index) {
        let cardDeck = document.querySelector(".deck");
        let cardItem = document.createElement("li");

        cardItem.setAttribute('id', index);
        cardItem.setAttribute('name', imagePath);
        cardItem.classList.add("card");

        // Set up the event listener for a card. If a card is clicked:
        cardItem.addEventListener('click', function() {
            startGame(this);
        });

        let cardImage = document.createElement("img");
        cardImage.src = imagePath; // Set the image source to the path in the cardImages array

        cardItem.appendChild(cardImage);
        cardDeck.appendChild(cardItem);
    });
}


// creat faunction to match crds
function startGame(tempCard) {

    timer();

    if (tempCard.classList.contains('match')) {
        return; // Do nothing if the card is already matched
    }

    tempCard.classList.add('open');
    tempCard.classList.add('show');

    // debugger;
    if (firstCard && secondCard) {
        //if null start to remove class open and show from first & scond card to can start from beging

        firstCard.classList.remove('open');
        firstCard.classList.remove('show');

        secondCard.classList.remove('open');
        secondCard.classList.remove('show');

        firstCard = null;
        secondCard = null;

    }
    //debugger;
    if (!visibleCard) {

        visibleCard = tempCard;
        movescount++;
        // console.log(movescount);
        
        moveCounter();
    } else {
        // Create object that's will have id and name
        let item = {
            id: tempCard.getAttribute('id'),
            name: tempCard.getAttribute('name')
        };

        if (checkMatchCard(item)) {

            tempCard.classList.add('match');
            tempCard.removeAttribute('onclick');

            visibleCard.classList.add('match');
            visibleCard.removeAttribute('onclick');

            matchCardnumber += 1;
            // console.log(matchCardnumber);

            // check if finshed game and user win 
            gameOver();
        }

        firstCard = tempCard;
        secondCard = visibleCard;
        visibleCard = null;

        // fire function clearSelectedCards () to can start click on new card
        clearSelectedCards();
    }
}

function checkMatchCard(item) {
    let card = {
        id: visibleCard.getAttribute('id'),
        name: visibleCard.getAttribute('name'),
        cardIsOpen: visibleCard.classList.contains('open')
    };

    return (item.name === card.name && item.id !== card.id && card.cardIsOpen);
}

// function to rmove class open and show from  cards [first and second card]
function clearSelectedCards() {
    setTimeout(() => {
        if (firstCard) {
            firstCard.classList.remove('open');
            firstCard.classList.remove('show');
            firstCard = null;
        }

        if (secondCard) {
            secondCard.classList.remove('open');
            secondCard.classList.remove('show');
            secondCard = null;
        }
    }, 1000);
}


//Game over funcatio to check if user finshed game or no
function gameOver() {
    // debugger;/
    if (matchCardnumber == 8) {
        setTimeout(function() { console.log("This is executed after 2 seconds."); }, 2000);

        let modal = document.querySelector('.popup');
        let close = document.querySelector('.close');

        document.querySelector("#moves").textContent = movescount;
        document.querySelector("#rating").textContent = ratingvalue;
        document.querySelector('#timer').textContent = timercount.getTimeValues().toString();

        //   debugger;
        modal.style.display = "block";

        close.onclick = function () {
            modal.style.display = "none";
            window.location.href = '../fun.html'; // Replace 'your-new-page.html' with the URL of the page you want to navigate to
        }
    }
}

// function to count moves
function moveCounter() {

    let movesContainer = document.querySelector('.moves');
    movesContainer.textContent = movescount;
    rating();
};


// Function to  play Again
function playAgain() {

    let restartbtn = document.querySelector('.restart');
    restartbtn.onclick = function () {
        location.reload();
    }

}

function rating() {
    
    for (star of stars) {
        // console.log(star[1])
        if (movescount === 19) {
            star[4].classList.remove("gold-star");
            ratingvalue = " ⭐⭐⭐⭐☆ ";
        }  else if (movescount ===21) {
            star[3].classList.remove("gold-star");
            ratingvalue = " ⭐⭐⭐☆☆ ";
        }  else if (movescount === 23) {
            star[2].classList.remove("gold-star");
            ratingvalue = " ⭐⭐☆☆☆ ";
        }  else if (movescount === 25) {
            star[1].classList.remove("gold-star");
            ratingvalue = " ⭐☆☆☆☆ ";
        }  else if (movescount === 30) {
            star[0].classList.remove("gold-star");
            ratingvalue = " ☆☆☆☆☆ ";
        } else if (movescount <= 18) {
            ratingvalue = " ⭐⭐⭐⭐⭐ ";
        }
    }

}

// funcation to track time for game

 function timer() {
   
    timercount.start();
    timercount.addEventListener('secondsUpdated', function (e) {

        let basicUsagetimer = document.querySelector('#basicUsage');
        basicUsagetimer.textContent = timercount.getTimeValues().toString();
    });

};


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

  function saveScore() {

    let playerName = prompt("Enter your name:");
    if (playerName)
    {
        const age = prompt("Enter your age:");

        if (age)
        {
            // Get a reference to the 'scores' node in the database
            var scoresRef = database.ref('Matching Pairs - Hard');

            console.log("Database name:", scoresRef);
            
            // Push a new score to the 'scores' node
            scoresRef.push({
                playerName: playerName,
                age: age,
                score: ratingvalue
            });
            alert("Score saved!");
            document.getElementById("save").style.display = 'none';
        }
    }
    //window.location.href = '../../levelMenu.html';
}

// fire function
generateGameBoard();
playAgain();

