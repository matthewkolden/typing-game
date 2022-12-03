// VARIABLES

// display
const score = document.getElementById("score");
const time = document.getElementById("time");
let playerScore = 0;
let timeRemaining = 60;

// game variables
const typeString = document.getElementById("type-string");
const userInput = document.getElementById("user-input");
const startBtn = document.getElementById("start");
let timer;
let currentQuote;

// let quote = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const quotes = [
    "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    "The way to get started is to quit talking and begin doing.",
    "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma.",
    "If life were predictable it would cease to be life, and be without flavor.",
    "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.",
    "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.",
    "Life is what happens when you're busy making other plans."
]


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

function newQuote() {
    const randomIndex = Math.floor(Math.random() * 7);
    currentQuote = quotes[randomIndex];
}

function typing() {
    const words = currentQuote.split("");
    words.forEach((letter) => {
        const lettersEl = document.createElement("i");
        lettersEl.textContent = letter;
        typeString.append(lettersEl);
    })
    // checkKeys();
}

function checkKeys(keyPress) {
    const words = document.querySelectorAll("i");
    let inputValue = userInput.value.split("");
    for (let i = 0; i < words.length - 1; i++) {
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

// EVENT LISTENERS

startBtn.addEventListener("click", () => {
    newQuote();
    // on clicking start button timing button starts
    startTimer();
    // when typing, user is shown whether what they typed was correct or incorrect
    typing();
    // after finishing typing the sentence, score is saved (remaining time)

    // if timer runs out, game is over and asks if user wants to play again
});

userInput.addEventListener("input", (key) => {
    if(timer) {
        checkKeys(key.data);
    }
    // console.log(key.data);
})