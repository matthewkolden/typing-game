// VARIABLES

// display
const score = document.getElementById("score");
const time = document.getElementById("time");
let playerScore = 0;
let timeRemaining = 60; //Level 1 initial time

// game variables
const typeString = document.getElementById("type-string");
const userInput = document.getElementById("user-input");
const startBtn = document.getElementById("start");
const levelEl = document.getElementById("level");
const gameOverEl = document.querySelector("#game-over");
const playAgainEl = document.getElementById("play-again");
const infoEl = document.querySelector(".info");
const exitEl = document.getElementById("exit");
let timer;
let currentQuote;
let currentQuoteLength;
let currentQuoteWords;
let currentStar = 1;
let currentLevel = 1;
let progress = 0;
let wordsTyped = 0;
let userIndex = 0;

const levels = {
  1: 60,
  2: 50,
  3: 45,
  4: 40,
  5: 35,
  6: 30,
};

// FUNCTIONS
function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      timeRemaining--;
      time.textContent = timeRemaining;
      if (timeRemaining <= 0) {
        gameOver();
        clearInterval(timer);
        // LOSE
      }
    }, 1000);
  }
}

function gameOver() {
  gameOverEl.style.display = "block";
}

async function getQuote() {
  typeString.textContent = ""; // Resets Quote
  const response = await fetch("https://api.quotable.io/random");
  const data = await response.json();
  if (response.ok) {
    currentQuote = data.content;
    currentQuoteLength = data.length;
  }
  // console.log(currentQuote);
}

function typing() {
  const letters = currentQuote.split("");
  letters.forEach((letter) => {
    const lettersEl = document.createElement("span");
    lettersEl.classList.add("letter");
    lettersEl.textContent = letter;
    typeString.append(lettersEl);
  });

  // checkKeys();
}

function checkKeys() {
  const words = document.querySelectorAll(".letter");
  let inputValue = userInput.value.split("");
  for (let i = 0; i < words.length; i++) {
    const letter = inputValue[i];
    if (letter === words[i].innerText) {
      words[i].classList.add("correct");
      words[i].classList.remove("incorrect");
    } else {
      words[i].classList.add("incorrect");
      words[i].classList.remove("correct");
    }
  }
}

function countWords(keyPressed) {
  const invalid = [".", ",", ";", " "];
  let numInvalid = 0;
  let wpm;

  const correctWords = document.querySelectorAll(".correct");
  for (let i = 0; i < correctWords.length; i++) {
    userIndex = i;
  }
  for (let j = 0; j < invalid.length; j++) {
    if (keyPressed === invalid[j]) {
      numInvalid++;
    }
  }
  userIndex -= numInvalid;
  // words per minute is calculated by counting every five letter except for invalid characters
  wpm = Math.round(
    (userIndex / 5 / (levels[currentLevel] - timeRemaining)) * 60
  );
  document.getElementById("score").textContent = wpm;
}

function checkWinner() {
  const checkCorrect = [];

  for (let i = 0; i < document.querySelectorAll(".letter").length; i++) {
    checkCorrect[i] = document
      .querySelectorAll(".letter")
      [i].classList.contains("correct");
  }
  if (checkCorrect.includes(false)) {
    return;
  } else {
    userInput.value = "";
    getQuote();
    typing();
    addStar();
    timeRemaining = levels[currentLevel];
    startTimer();
  }
}

function addStar() {
  const currentStarEl = document.querySelectorAll(`.star-${currentStar}`);
  const stars = document.querySelectorAll(`.star-complete`);
  if (currentStar < 3) {
    currentStarEl.forEach((star) => {
      star.classList.add("star-complete");
      star.classList.remove("star-incomplete");
    });
    progress += 100 / 3;
    document.querySelector(".current-progress").style.width = `${progress}%`;
    currentStar++;
  } else {
    nextLevel();
    stars.forEach((star) => {
      star.classList.remove("star-complete");
      star.classList.add("star-incomplete");
    });
    progress = 0;
    document.querySelector(".current-progress").style.width = `${progress}%`;
    currentStar = 1;
  }
}

function nextLevel() {
  currentLevel++;
  levelEl.textContent = currentLevel;
}

// EVENT LISTENERS

document.addEventListener("DOMContentLoaded", getQuote); // Loads quote before game is started

startBtn.addEventListener("click", () => {
  getQuote();
  if (currentQuote) {
    startBtn.classList.add("hidden");
    startTimer();
    typing();
  }
});

userInput.addEventListener("input", (key) => {
  if (timer) {
    checkKeys();
    countWords(key.data);
    // Check to see if user input all words correctly; if so change quote
    checkWinner();
  }
});

playAgainEl.addEventListener("click", () => {
  window.location.reload();
});

infoEl.addEventListener("click", () => {
  document.getElementById("how-to").style.display = "block";
});

exitEl.addEventListener("click", () => {
  document.getElementById("how-to").style.display = "none";
});
