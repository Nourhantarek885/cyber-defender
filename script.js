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

const achievement = document.getElementById("achievement");
const comboAchievement = document.getElementById("combo-achievement");
const masterAchievement = document.getElementById("master-achievement");

const firstHitPanel =
    document.getElementById("achievement-first-hit");

const comboFivePanel =
    document.getElementById("achievement-combo-five");

const cyberMasterPanel =
    document.getElementById("achievement-cyber-master");

let firstHitUnlocked = false;
let comboFiveUnlocked = false;
let cyberMasterUnlocked = false;

const achievements = {
    firstHit: false,
    comboFive: false,
    cyberMaster: false
};

const savedAchievements =
    JSON.parse(
        localStorage.getItem("cyberDefenderAchievements")
    );

if (savedAchievements) {
    achievements.firstHit = savedAchievements.firstHit || false;
    achievements.comboFive = savedAchievements.comboFive || false;
    achievements.cyberMaster = savedAchievements.cyberMaster || false;
}

let highScore =
    Number(
        localStorage.getItem("cyberDefenderHighScore")
    ) || 0;

highScoreElement.textContent = highScore;
startHighScoreElement.textContent = highScore;


// =========================
// SOUND
// =========================

const audioContext =
    new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = "sine") {

    const oscillator =
        audioContext.createOscillator();

    const gainNode =
        audioContext.createGain();

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

    oscillator.stop(
        audioContext.currentTime + duration
    );
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
// ACHIEVEMENTS
// =========================

function saveAchievements() {

    localStorage.setItem(
        "cyberDefenderAchievements",
        JSON.stringify(achievements)
    );
}

function updateAchievementsPanel() {

    if (achievements.firstHit && firstHitPanel) {
        firstHitPanel.classList.add("unlocked");
        firstHitPanel.querySelector("span").textContent = "🔓";
    }

    if (achievements.comboFive && comboFivePanel) {
        comboFivePanel.classList.add("unlocked");
        comboFivePanel.querySelector("span").textContent = "🔓";
    }

    if (achievements.cyberMaster && cyberMasterPanel) {
        cyberMasterPanel.classList.add("unlocked");
        cyberMasterPanel.querySelector("span").textContent = "🔓";
    }
}

function unlockFirstHit() {

    if (firstHitUnlocked) return;

    firstHitUnlocked = true;

    achievements.firstHit = true;

    saveAchievements();
    updateAchievementsPanel();

    achievement.classList.remove("show");

    void achievement.offsetWidth;

    achievement.classList.add("show");
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

    firstHitUnlocked = false;
    comboFiveUnlocked = false;
    cyberMasterUnlocked = false;

    achievement.classList.remove("show");
    comboAchievement.classList.remove("show");
    masterAchievement.classList.remove("show");

    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    livesElement.textContent = "❤️❤️❤️";

    timerElement.parentElement.classList.remove("danger");
    livesElement.parentElement.classList.remove("danger");

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

        highScoreElement.textContent =
            highScore;
    }
}


// =========================
// DIFFICULTY
// =========================

function updateDifficulty() {

    if (score >= 10) {

        difficultyElement.textContent = "HARD";

        difficultyElement.style.color =
            "#ff3333";

        difficultyElement.style.textShadow =
            "0 0 15px #ff3333";

    } else if (score >= 5) {

        difficultyElement.textContent = "MEDIUM";

        difficultyElement.style.color =
            "#ffff00";

        difficultyElement.style.textShadow =
            "0 0 15px #ffff00";

    } else {

        difficultyElement.textContent = "EASY";

        difficultyElement.style.color =
            "#00ff88";

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

        timerElement.textContent =
            timeLeft;

        if (timeLeft <= 10) {

            timerElement.parentElement
                .classList.add("danger");

        } else {

            timerElement.parentElement
                .classList.remove("danger");
        }

        if (timeLeft <= 0) {
            winGame();
        }

    }, 1000);
}


// =========================
// VICTORY
// =========================

function winGame() {

    gameRunning = false;

    clearInterval(timerInterval);

    updateHighScore();

    document
        .querySelectorAll(".threat")
        .forEach(function (threat) {
            threat.remove();
        });

    message.textContent =
        "🏆 VICTORY! Score: " + score;

    message.style.display = "block";

    setTimeout(function () {

        gameScreen.style.display = "none";

        startScreen.style.display = "flex";

        startHighScoreElement.textContent =
            highScore;

    }, 2500);
}


// =========================
// LIVES
// =========================

function loseLife() {

    if (!gameRunning) return;

    lives--;

    livesElement.textContent =
        "❤️".repeat(lives);

    playLifeLostSound();

    if (lives <= 1) {

        livesElement.parentElement
            .classList.add("danger");

    } else {

        livesElement.parentElement
            .classList.remove("danger");
    }

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

        startHighScoreElement.textContent =
            highScore;

    }, 2500);
}


// =========================
// CREATE THREAT
// =========================

function createThreat() {

    if (!gameRunning) return;

    const threat =
        document.createElement("div");

    threat.textContent = "⚠️";

    threat.classList.add("threat");

    threat.style.position = "absolute";
    threat.style.fontSize = "35px";
    threat.style.cursor = "pointer";

    const maxX =
        gameArea.clientWidth - 40;

    const maxY =
        gameArea.clientHeight - 40;

    threat.style.left =
        Math.random() * maxX + "px";

    threat.style.top =
        Math.random() * maxY + "px";


    threat.onclick = function () {

        if (!gameRunning) return;

        playHitSound();

        unlockFirstHit();

        score++;

        scoreElement.textContent =
            score;

        if (
            score >= 5 &&
            !comboFiveUnlocked
        ) {

            comboFiveUnlocked = true;

            achievements.comboFive = true;

            saveAchievements();
            updateAchievementsPanel();

            comboAchievement.classList.remove("show");

            void comboAchievement.offsetWidth;

            comboAchievement.classList.add("show");
        }


        if (
            score >= 10 &&
            !cyberMasterUnlocked
        ) {

            cyberMasterUnlocked = true;

            achievements.cyberMaster = true;

            saveAchievements();
            updateAchievementsPanel();

            masterAchievement.classList.remove("show");

            void masterAchievement.offsetWidth;

            masterAchievement.classList.add("show");
        }

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


// =========================
// LOAD ACHIEVEMENTS
// =========================

updateAchievementsPanel();
