let score = 0;
let gameRunning = false;
let timeLeft = 30;
let lives = 3;
let timerInterval;

const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const livesElement = document.getElementById("lives");
const difficultyElement = document.getElementById("difficulty");
const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-button");
const message = document.getElementById("message");

startButton.onclick = startGame;

function startGame() {
    score = 0;
    timeLeft = 30;
    lives = 3;
    gameRunning = true;

    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    livesElement.textContent = "❤️❤️❤️";

    message.style.display = "none";

    startButton.textContent = "GAME RUNNING";
    startButton.disabled = true;

    updateDifficulty();

    startTimer();
    createThreat();
}

function updateDifficulty() {
    if (score >= 10) {
        difficultyElement.textContent = "HARD";
        difficultyElement.style.color = "#ff3333";
        difficultyElement.style.textShadow = "0 0 15px #ff3333";
    } else if (score >= 5) {
        difficultyElement.textContent = "MEDIUM";
        difficultyElement.style.color = "#ffff00";
        difficultyElement.style.textShadow = "0 0 15px #ffff00";
    } else {
        difficultyElement.textContent = "EASY";
        difficultyElement.style.color = "#00ff88";
        difficultyElement.style.textShadow = "0 0 15px #00ff88";
    }
}

function getThreatSpeed() {
    if (score >= 10) {
        return 700;
    } else if (score >= 5) {
        return 1000;
    } else {
        return 1500;
    }
}

function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(function () {
        timeLeft--;

        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame("TIME'S UP!");
        }
    }, 1000);
}

function loseLife() {
    if (!gameRunning) return;

    lives--;

    livesElement.textContent = "❤️".repeat(lives);

    if (lives <= 0) {
        endGame("NO LIVES LEFT!");
    }
}

function endGame(reason) {
    gameRunning = false;

    clearInterval(timerInterval);

    document.querySelectorAll(".threat").forEach(function (threat) {
        threat.remove();
    });

    message.textContent = reason + " Score: " + score;
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

        updateDifficulty();

        threat.remove();

        createThreat();
    };

    gameArea.appendChild(threat);

    setTimeout(function () {
        if (threat.parentElement && gameRunning) {
            threat.remove();

            loseLife();

            if (gameRunning) {
                createThreat();
            }
        }
    }, getThreatSpeed());
}
