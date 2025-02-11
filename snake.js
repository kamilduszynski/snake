// Get elements
const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");

const scoreCanvas = document.getElementById("scoreCanvas");
const scoreCtx = scoreCanvas.getContext("2d");

const darkModeButton = document.getElementById("darkModeButton");
const startButton = document.getElementById("startButton");

const controls = document.getElementById("controls");
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

// Load sounds
const music = new Audio("assets/arcade_music.mp3");
const eatSound = new Audio("assets/arcade_eat.mp3");
const gameOverSound = new Audio("assets/arcade_gameover.mp3");

// Load images
const snakeHeadImg = new Image();
snakeHeadImg.src = "assets/head.png";

const mouseImg = new Image();
mouseImg.src = "assets/mouse.png";

// Load fonts
const pixelFont = new FontFace("Pixel", "url(assets/pixel_font.ttf)");
pixelFont.load();
document.fonts.add(pixelFont);

// Call resizeCanvas when the window loads and resizes and check if the device is touch-enabled
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

let food;
let snake;
let score;
let boxSize;
let direction;
let gameInterval;
let gameIntervalValue;
let darkMode = localStorage.getItem("darkMode");
let scoreColor = localStorage.getItem("scoreColor");

const enableDarkMode = () => {
    document.body.classList.add("darkMode");
    localStorage.setItem("darkMode", "active");
    localStorage.setItem("scoreColor", "white");
}

const disableDarkMode = () => {
    document.body.classList.remove("darkMode");
    localStorage.setItem("darkMode", null);
    localStorage.setItem("scoreColor", "black");
}

if (darkMode === "active") enableDarkMode()

// Event listener for dark mode button
darkModeButton.addEventListener("click", () => {
    darkMode = localStorage.getItem("darkMode");
    darkMode !== "active" ? enableDarkMode() : disableDarkMode();
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
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") changeDirection("LEFT");
            if (event.key === "ArrowUp") changeDirection("UP");
            if (event.key === "ArrowRight") changeDirection("RIGHT");
            if (event.key === "ArrowDown") changeDirection("DOWN");
        });
    } else {
        controls.style.display = "flex";
        document.getElementById("upButton").addEventListener("click", () => changeDirection("UP"));
        document.getElementById("downButton").addEventListener("click", () => changeDirection("DOWN"));
        document.getElementById("leftButton").addEventListener("click", () => changeDirection("LEFT"));
        document.getElementById("rightButton").addEventListener("click", () => changeDirection("RIGHT"));
    }
}

function changeDirection(newDirection) {
    if (directionChanged) return; // Prevent changing direction more than once per game loop iteration

    if (newDirection === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    if (newDirection === "UP" && direction !== "DOWN") direction = "UP";
    if (newDirection === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
    if (newDirection === "DOWN" && direction !== "UP") direction = "DOWN";

    directionChanged = true; // Set the flag to true after changing direction
}

// Initialize game
function initGame() {
    music.play();
    music.loop = true;
    music.volume = 0.05;
    music.playbackRate = 1.25;
    eatSound.playbackRate = 2;

    score = 0;
    direction = "RIGHT";
    gameIntervalValue = 150;
    gameInterval = setInterval(gameLoop, gameIntervalValue);

    snake = [{ x: 10 * boxSize, y: 10 * boxSize }];
    generateFood();

    startButton.style.display = "none";
    checkDevice();
}

// Generating Food
function generateFood() {
    x = Math.floor(Math.random() * 20) * boxSize;
    y = Math.floor(Math.random() * 20) * boxSize;
    while (snake.some(segment => segment.x === x && segment.y === y)) {
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
    if (snake.some(segment => segment.x === headX && segment.y === headY)) {
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
    if (score % 10 === 0 && score > 0 && gameIntervalValue > 25 && !speedIncreased) {
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
            gameCtx.arc(part.x + boxSize / 2, part.y + boxSize / 2, boxSize / 2, 0, Math.PI * 2);
            gameCtx.fill();
            gameCtx.lineWidth = 2;
            gameCtx.strokeStyle = "black";
            gameCtx.stroke();
        }
    });
}

// Function to draw the score separately
function drawScore() {
    scoreColor = "black";
    scoreColor = localStorage.getItem("scoreColor");

    scoreCtx.fillStyle = scoreColor;
    scoreCtx.font = boxSize + "px Pixel";
    scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    scoreCtx.fillText("Score: " + score, boxSize * 8, boxSize);
}

function gameLoop() {
    updateGame();
    drawGame();
    drawScore();
}

function gameOver() {
    music.pause();
    gameOverSound.play();
    
    clearInterval(gameInterval); // Stop game
    alert("Game Over!\nYour score: " + score);

    document.location.reload();
}

// Start game
function startGame() {
    initGame();
}
