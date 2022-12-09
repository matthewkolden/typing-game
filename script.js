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
const levelEl = document.querySelectorAll(".level");
const gameOverEl = document.querySelector("#game-over");
const playAgainEl = document.getElementById("play-again");
const infoEl = document.querySelector(".info");
const exitEl = document.getElementById("exit");
const nextLevelEl = document.getElementById("next-level");
const nextLevelBtn = document.getElementById("next");

let timer;
let currentQuote;
let currentQuoteLength;
let currentQuoteWords;
let currentStar = 1;
let currentLevel = 1;
let progress = 0;
let wordsTyped = 0;
let userIndex = 0;
let wpm;
let wpmScores = [];
let avgWpm;

const levels = {
  1: 60,
  2: 50,
  3: 45,
  4: 40,
  5: 35,
  6: 30,
  7: 25,
  8: 20,
  9: 15,
  10: 10
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
    wpmScores.push(wpm);
    getQuote();
    typing();
    addStar();
    timeRemaining = levels[currentLevel];
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
    currentStarEl.forEach((star) => {
      star.classList.add("star-complete");
      star.classList.remove("star-incomplete");
    });
    nextLevel();
  }
}

function nextLevel() {
  const wpmEl = document.getElementById("wpm");
  let totalWpm = 0;
  let index = 0
  for (let i = 0; i < wpmScores.length; i++) {
      totalWpm += wpmScores[i]
      index++
  }
  avgWpm = Math.round(totalWpm / index);
  wpmEl.textContent = avgWpm;
  nextLevelEl.style.display = "block";
  clearInterval(timer);
  timer = null;
  currentLevel++;

  wpmScores = [];
  avgWpm = 0;
  score.textContent = "0";
  time.textContent = "0";
}

function reset() {
  startBtn.classList.remove("hidden");
  gameOverEl.style.display = "none";
  typeString.textContent = "";

  progress = 0;
  document.querySelector(".current-progress").style.width = `${progress}%`;

  currentLevel = 1;
  levelEl.textContent = currentLevel;

  document.querySelectorAll(`.star-complete`).forEach((star) => {
    star.classList.remove("star-complete");
    star.classList.add("star-incomplete");
  });

  wpm = 0;
  avgWpm = 0;
  wpmScores = [];
  document.getElementById("score").textContent = wpm;

  timeRemaining = 60;
  time.textContent = timeRemaining;
  timer = null;
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

playAgainEl.addEventListener("click", reset);

infoEl.addEventListener("click", () => {
  document.getElementById("how-to").style.display = "block";
});

exitEl.addEventListener("click", () => {
  document.getElementById("how-to").style.display = "none";
});

nextLevelBtn.addEventListener("click", () => {
  nextLevelEl.style.display = "none";
  levelEl.forEach((level) => {
    level.textContent = currentLevel;
  })
  startTimer();
  const stars = document.querySelectorAll(`.star-complete`);
  stars.forEach((star) => {
    star.classList.remove("star-complete");
    star.classList.add("star-incomplete");
  });
  progress = 0;
  document.querySelector(".current-progress").style.width = `${progress}%`;
  currentStar = 1;
})