let score = 0;
let gameRunning = false;
let timeLeft = 30;
let lives = 3;
let timerInterval;

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const startHighScoreElement = document.getElementById("start-high-score");
const timerElement = document.getElementById("timer");
const livesElement = document.getElementById("lives");
const difficultyElement = document.getElementById("difficulty");

const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-button");
const message = document.getElementById("message");

let highScore =
    Number(localStorage.getItem("cyberDefenderHighScore")) || 0;

highScoreElement.textContent = highScore;
startHighScoreElement.textContent = highScore;


// =========================
// SOUND EFFECTS
// =========================

const audioContext =
    new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = "sine") {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(
        0.15,
        audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

function playHitSound() {
    playSound(700, 0.1, "square");
}

function playLifeLostSound() {
    playSound(180, 0.25, "sawtooth");
}

function playGameOverSound() {
    playSound(120, 0.5, "sawtooth");
}


// =========================
// START GAME
// =========================

startButton.onclick = startGame;

function startGame() {

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    startScreen.style.display = "none";
    gameScreen.style.display = "block";

    score = 0;
    timeLeft = 30;
    lives = 3;
    gameRunning = true;

    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    livesElement.textContent = "❤️❤️❤️";

    message.style.display = "none";

    updateDifficulty();

    startTimer();
    createThreat();
}


// =========================
// HIGH SCORE
// =========================

function updateHighScore() {

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "cyberDefenderHighScore",
            highScore
        );

        highScoreElement.textContent = highScore;
    }
}


// =========================
// DIFFICULTY
// =========================

function updateDifficulty() {

    if (score >= 10) {

        difficultyElement.textContent = "HARD";
        difficultyElement.style.color = "#ff3333";
        difficultyElement.style.textShadow =
            "0 0 15px #ff3333";

    } else if (score >= 5) {

        difficultyElement.textContent = "MEDIUM";
        difficultyElement.style.color = "#ffff00";
        difficultyElement.style.textShadow =
            "0 0 15px #ffff00";

    } else {

        difficultyElement.textContent = "EASY";
        difficultyElement.style.color = "#00ff88";
        difficultyElement.style.textShadow =
            "0 0 15px #00ff88";
    }
}

function getThreatSpeed() {

    if (score >= 10) {
        return 700;
    }

    if (score >= 5) {
        return 1000;
    }

    return 1500;
}


// =========================
// TIMER
// =========================

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


// =========================
// LIVES
// =========================

function loseLife() {

    if (!gameRunning) return;

    lives--;

    livesElement.textContent = "❤️".repeat(lives);

    playLifeLostSound();

    if (lives <= 0) {
        endGame("NO LIVES LEFT!");
    }
}


// =========================
// GAME OVER
// =========================

function endGame(reason) {

    gameRunning = false;

    clearInterval(timerInterval);

    playGameOverSound();

    updateHighScore();

    document
        .querySelectorAll(".threat")
        .forEach(function (threat) {
            threat.remove();
        });

    message.textContent =
        reason + " Score: " + score;

    message.style.display = "block";

    setTimeout(function () {

        gameScreen.style.display = "none";
        startScreen.style.display = "flex";

        startHighScoreElement.textContent = highScore;

    }, 2500);
}


// =========================
// CREATE THREAT
// =========================

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

    threat.style.left =
        Math.random() * maxX + "px";

    threat.style.top =
        Math.random() * maxY + "px";


    threat.onclick = function () {

        if (!gameRunning) return;

        playHitSound();

        score++;

        scoreElement.textContent = score;

        updateDifficulty();

        threat.remove();

        createThreat();
    };


    gameArea.appendChild(threat);


    setTimeout(function () {

        if (
            threat.parentElement &&
            gameRunning
        ) {

            threat.remove();

            loseLife();

            if (gameRunning) {
                createThreat();
            }
        }

    }, getThreatSpeed());
}
