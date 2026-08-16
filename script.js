let score = 0;
let gameRunning = false;

const scoreElement = document.getElementById("score");
const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-button");
const message = document.getElementById("message");

startButton.onclick = function () {
    startGame();
};

function startGame() {
    score = 0;
    gameRunning = true;

    scoreElement.textContent = score;
    message.style.display = "none";
    startButton.textContent = "GAME RUNNING";

    createThreat();
}

function createThreat() {
    if (!gameRunning) return;

    const threat = document.createElement("div");

    threat.textContent = "⚠️";
    threat.style.position = "absolute";
    threat.style.fontSize = "35px";
    threat.style.cursor = "pointer";

    const maxX = gameArea.clientWidth - 40;
    const maxY = gameArea.clientHeight - 40;

    threat.style.left = Math.random() * maxX + "px";
    threat.style.top = Math.random() * maxY + "px";

    threat.onclick = function () {
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
