// Get elements
const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");

const scoreCanvas = document.getElementById("scoreCanvas");
const scoreCtx = scoreCanvas.getContext("2d");

const darkModeButton = document.getElementById("darkModeButton");
const startButton = document.getElementById("startButton");

const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

const scoreboard = document.getElementById("scoreboard");

// Load sounds
const music = new Audio("assets/sounds/arcade_music.mp3");
const eatSound = new Audio("assets/sounds/arcade_eat.mp3");
const gameOverSound = new Audio("assets/sounds/arcade_gameover.mp3");

// Load images
const mouseImg = new Image();
const snakeHeadImg = new Image();

mouseImg.src = "assets/images/mouse.png";
snakeHeadImg.src = "assets/images/head.png";

// Load fonts
// const pixelFont = new FontFace("Pixel", "url(assets/fonts/pixel_font.ttf)");
// pixelFont.load();
// document.fonts.add(pixelFont);

// Call resizeCanvas when the window loads and resizes and check if the device is touch-enabled
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

let food;
let snake;
let score;
let boxSize;
let direction;
let gameStopped;
let gameInterval;
let gameIntervalValue;
let darkMode = localStorage.getItem("darkMode");
let scoreColor = localStorage.getItem("scoreColor");

const enableDarkMode = () => {
    document.body.classList.add("darkMode");
    localStorage.setItem("darkMode", "active");
    localStorage.setItem("scoreColor", "white");
};

const disableDarkMode = () => {
    document.body.classList.remove("darkMode");
    localStorage.setItem("darkMode", null);
    localStorage.setItem("scoreColor", "black");
};

if (darkMode === "active") enableDarkMode();

// Event listener for dark mode button
darkModeButton.addEventListener("click", () => {
    darkMode = localStorage.getItem("darkMode");
    darkMode !== "active" ? enableDarkMode() : disableDarkMode();

    if (gameStopped) {
        scoreColor = localStorage.getItem("scoreColor");
        drawScore();
    }
});

// Function to resize canvas based on screen size
function resizeCanvas() {
    screenSize = Math.min(window.innerWidth, window.innerHeight) * 0.7; // 70% of the smaller screen dimension
    screenSize = Math.floor(screenSize / 20) * 20; // Round to nearest multiple of 20 for consistency
    boxSize = screenSize / 20; // Scale boxSize dynamically

    gameCanvas.width = screenSize;
    gameCanvas.height = screenSize;

    scoreCanvas.width = screenSize;
    scoreCanvas.height = boxSize;
}

function checkDevice() {
    const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") changeDirection("LEFT");
            if (event.key === "ArrowUp") changeDirection("UP");
            if (event.key === "ArrowRight") changeDirection("RIGHT");
            if (event.key === "ArrowDown") changeDirection("DOWN");
        });
    } else {
        document.addEventListener("touchstart", (event) => {
            let tapX = event.touches[0].clientX;
            let tapY = event.touches[0].clientY;

            showTouchIndicator(tapX, tapY);
            detectDirection(tapX, tapY);
        });
    }
}

function showTouchIndicator(x, y) {
    let dot = document.createElement("div");
    dot.classList.add("touchIndicator");
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    document.body.appendChild(dot);

    setTimeout(() => {
        dot.style.opacity = "0";
        setTimeout(() => dot.remove(), 500);
    }, 300);
}

function detectDirection(x, y) {
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;

    if (Math.abs(x - centerX) > Math.abs(y - centerY)) {
        newDirection = x > centerX ? "RIGHT" : "LEFT";
    } else {
        newDirection = y > centerY ? "DOWN" : "UP";
    }

    changeDirection(newDirection);
}

function changeDirection(newDirection) {
    if (directionChanged) return; // Prevent changing direction more than once per game loop iteration

    if (newDirection === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    if (newDirection === "UP" && direction !== "DOWN") direction = "UP";
    if (newDirection === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
    if (newDirection === "DOWN" && direction !== "UP") direction = "DOWN";

    directionChanged = true; // Set the flag to true after changing direction
}

// Generating Food
function generateFood() {
    x = Math.floor(Math.random() * 20) * boxSize;
    y = Math.floor(Math.random() * 20) * boxSize;
    while (snake.some((segment) => segment.x === x && segment.y === y)) {
        x = Math.floor(Math.random() * 20) * boxSize;
        y = Math.floor(Math.random() * 20) * boxSize;
    }
    food = { x, y };
}

function updateGame() {
    var headX = snake[0].x;
    var headY = snake[0].y;

    if (direction === "LEFT") headX -= boxSize;
    if (direction === "UP") headY -= boxSize;
    if (direction === "RIGHT") headX += boxSize;
    if (direction === "DOWN") headY += boxSize;

    // Check for collisions with itself
    if (snake.some((segment) => segment.x === headX && segment.y === headY)) {
        gameOver();
        return;
    }

    // Go to opposite wall
    if (headX < 0) headX = gameCanvas.width;
    else if (headX >= gameCanvas.width) headX = 0;
    else if (headY < 0) headY = gameCanvas.height;
    else if (headY >= gameCanvas.height) headY = 0;

    newHead = { x: headX, y: headY };
    snake.unshift(newHead);

    if (headX === food.x && headY === food.y) {
        score++;
        eatSound.play();
        generateFood();
        speedIncreased = false; // Reset the flag when food is eaten
    } else {
        snake.pop();
    }

    // Increase speed as score increases
    if (
        score % 10 === 0 &&
        score > 0 &&
        gameIntervalValue > 25 &&
        !speedIncreased
    ) {
        increaseSpeed();
        speedIncreased = true; // Set the flag to true after increasing speed
    }

    directionChanged = false; // Reset the direction change flag
}

function increaseSpeed() {
    console.log("Increasing speed");
    console.log("Old interval: " + gameIntervalValue);
    gameIntervalValue -= 25;
    console.log("New interval: " + gameIntervalValue);
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameIntervalValue);
    console.log("Speed increased!");
}

function drawGame() {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw food
    gameCtx.drawImage(mouseImg, food.x, food.y, boxSize, boxSize);

    // Draw snake
    snake.forEach((part, index) => {
        if (index === 0) {
            // Draw snake head
            gameCtx.drawImage(snakeHeadImg, part.x, part.y, boxSize, boxSize);
        } else {
            // Draw snake body
            gameCtx.fillStyle = "#8fc43c";
            gameCtx.beginPath();
            gameCtx.arc(
                part.x + boxSize / 2,
                part.y + boxSize / 2,
                boxSize / 2,
                0,
                Math.PI * 2
            );
            gameCtx.fill();
            gameCtx.lineWidth = 3;
            gameCtx.strokeStyle = "black";
            gameCtx.stroke();
        }
    });
}

// Draw the score separately
function drawScore() {
    scoreColor = "black";
    scoreColor = localStorage.getItem("scoreColor");

    scoreCtx.fillStyle = scoreColor;
    scoreCtx.font = boxSize + "px Pixel";
    scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    scoreCtx.fillText("Score: " + score, boxSize * 8, boxSize);
}

// Submit score
function submitScore(playerName, score) {
    db.ref("scores/").push({
        name: playerName,
        score: score,
    });
}

// Fetch and display high scores
function fetchScores() {
    db.ref("scores/")
        .orderByChild("score")
        .limitToLast(10)
        .once("value", (snapshot) => {
            let scores = [];
            snapshot.forEach((child) => {
                scores.unshift(child.val());
            });
            scoreboard.innerHTML = "<h2>Leaderboard</h2>";
            scores.forEach((entry) => {
                scoreboard.innerHTML += `<p>${entry.name}: ${entry.score}</p>`;
            });
        });

    scoreboard.style.display = "block";
}

function gameOver() {
    gameStopped = true;

    music.pause();
    gameOverSound.play();
    clearInterval(gameInterval); // Stop game

    let playerName = prompt("Game Over! Enter your name:");

    if (playerName) {
        while (playerName.length > 50) {
            alert("Name too long! Please enter up to 50 characters");
            playerName = prompt("Enter your name:");
        }

        submitScore(playerName, score);
        fetchScores(); // Refresh leaderboard
    }

    startButton.style.display = "block";
}

function gameLoop() {
    updateGame();
    drawGame();
    drawScore();
}

// Initialize game
function initGame() {
    scoreboard.style.display = "none"; // Hide the leaderboard
    startButton.style.display = "none"; // Hide the start button

    music.play();
    music.loop = true;
    music.volume = 0.05;
    music.playbackRate = 1.25;
    eatSound.playbackRate = 2;

    score = 0;
    direction = "RIGHT";
    gameStopped = false;
    gameIntervalValue = 150;
    gameInterval = setInterval(gameLoop, gameIntervalValue);
    snake = [{ x: 10 * boxSize, y: 10 * boxSize }];

    generateFood();
    checkDevice();
}

// Start game
function startGame() {
    initGame();
}
