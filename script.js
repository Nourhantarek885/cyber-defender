let score = 0;
let gameRunning = false;
let timeLeft = 30;
let timerInterval;

const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-button");
const message = document.getElementById("message");

startButton.onclick = function () {
    startGame();
};

function startGame() {
    score = 0;
    timeLeft = 30;
    gameRunning = true;

    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;

    message.style.display = "none";
    startButton.textContent = "GAME RUNNING";
    startButton.disabled = true;

    startTimer();
    createThreat();
}

function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(function () {
        timeLeft--;

        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameRunning = false;

    clearInterval(timerInterval);

    document.querySelectorAll(".threat").forEach(function (threat) {
        threat.remove();
    });

    message.textContent = "GAME OVER! Score: " + score;
    message.style.display = "block";

    startButton.textContent = "PLAY AGAIN";
    startButton.disabled = false;
}

function createThreat() {
    if (!gameRunning) return;

    const threat = document.createElement("div");

    threat.textContent = "⚠️";
    threat.classList.add("threat");

    threat.style.position = "absolute";
    threat.style.fontSize = "35px";
    threat.style.cursor = "pointer";

    const maxX = gameArea.clientWidth - 40;
    const maxY = gameArea.clientHeight - 40;

    threat.style.left = Math.random() * maxX + "px";
    threat.style.top = Math.random() * maxY + "px";

    threat.onclick = function () {
        if (!gameRunning) return;

        score++;
        scoreElement.textContent = score;

        threat.remove();

        createThreat();
    };

    gameArea.appendChild(threat);

    setTimeout(function () {
        if (threat.parentElement) {
            threat.remove();
            createThreat();
        }
    }, 1500);
}
