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
let timer;
let currentQuote;
let currentStar = 1;
let currentLevel = 1;

const levels = {
    1: 60,
    2: 50,
    3: 45,
    4: 40,
    5: 35,
    6: 30
};

// let quote = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
// const quotes = [
//     "The greatest glory in living lies not in never falling, but in rising every time we fall.",
//     "The way to get started is to quit talking and begin doing.",
//     "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma.",
//     "If life were predictable it would cease to be life, and be without flavor.",
//     "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.",
//     "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.",
//     "Life is what happens when you're busy making other plans."
// ]


// FUNCTIONS
function startTimer() {
    if(!timer) {
        timer = setInterval(() => {
            timeRemaining--;
            time.textContent = timeRemaining;
            if (timeRemaining <= 0) {
                clearInterval(timer);
                // LOSE
            }
        }, 1000);
    }
}

async function getQuote() {
    typeString.textContent =''; // Resets Quote
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    if(response.ok) {
        currentQuote = data.content;
    }
    // const randomIndex = Math.floor(Math.random() * 7);
    // currentQuote = quotes[randomIndex];
    // console.log(currentQuote)
}

function typing() {
    const words = currentQuote.split("");
    words.forEach((letter) => {
        const lettersEl = document.createElement("span");
        lettersEl.classList.add("letter");
        lettersEl.textContent = letter;
        typeString.append(lettersEl);
    })
    // checkKeys();
}

function checkKeys() {
    const words = document.querySelectorAll(".letter");
    let inputValue = userInput.value.split("");
    for (let i = 0; i < words.length; i++) {
        const letter = inputValue[i];
        if(letter === words[i].innerText) {
            words[i].classList.add("correct");
            words[i].classList.remove("incorrect");
        } else {
            words[i].classList.add("incorrect");
            words[i].classList.remove("correct");
        }
    }
}

function checkWinner() {
        const checkCorrect = []
        for (let i = 0 ; i < document.querySelectorAll(".letter").length; i++) {
            checkCorrect[i] = document.querySelectorAll(".letter")[i].classList.contains("correct");
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
    const currentStarEl = document.querySelector(`.star-${currentStar}`);
    const stars = document.querySelectorAll(`.star-complete`);
    if(currentStar < 3) {
        currentStarEl.classList.add("star-complete");
        currentStarEl.classList.remove("star-incomplete");
        currentStar++;
    } else {
        nextLevel();
        stars.forEach((star)=> {
            star.classList.remove("star-complete");
            star.classList.add("star-incomplete");
        })
        currentStar = 1;
    }
}

function nextLevel() {
    currentLevel++;
    levelEl.textContent = currentLevel;
}

// EVENT LISTENERS

document.addEventListener("DOMContentLoaded", getQuote);

startBtn.addEventListener("click", () => {
    getQuote();
    if (currentQuote) {
        startBtn.classList.add("hidden");
        // on clicking start button timing button starts
        startTimer();
        // when typing, user is shown whether what they typed was correct or incorrect
        typing();
        // after finishing typing the sentence, score is saved (remaining time)

        // if timer runs out, game is over and asks if user wants to play again
    }
});

userInput.addEventListener("input", () => {
    if(timer) {
        checkKeys();
        // Check to see if user input all words correctly; if so change quote
        checkWinner();
    }
    // console.log(key.data);

})