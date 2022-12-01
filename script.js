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

// EVENT LISTENERS

startBtn.addEventListener("click", () => {
    // on clicking start button timing button starts
    startTimer();
});