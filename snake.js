// Get elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const darkModeButton = document.getElementById("darkModeButton");
const startButton = document.getElementById("startButton");
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

// Call resizeCanvas when the window loads and resizes and check if the device is touch-enabled
window.onload = checkDevice;
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

let boxSize;
let snake, food, direction, score, gameInterval;
let darkmode = localStorage.getItem("darkmode");

const enableDarkMode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "active");
}

const disableDarkMode = () => {
    document.body.classList.remove("darkmode");
    localStorage.setItem("darkmode", null);
}

if (darkmode === "active") enableDarkMode()

// Event listener for dark mode button
darkModeButton.addEventListener("click", () => {
    darkmode = localStorage.getItem("darkmode");
    darkmode !== "active" ? enableDarkMode() : disableDarkMode();
});

// Function to resize canvas based on screen size
function resizeCanvas() {
    var screenSize = Math.min(window.innerWidth, window.innerHeight) * 0.7; // 70% of the smaller screen dimension
    screenSize = Math.floor(screenSize / 20) * 20; // Round to nearest multiple of 20 for consistency

    canvas.width = screenSize;
    canvas.height = screenSize;

    boxSize = screenSize / 20; // Scale boxSize dynamically
}

function checkDevice() {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const controls = document.getElementById("controls");

    if (!isTouchDevice) {
        controls.style.display = "none"; // Hide controls on desktop
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") changeDirection("LEFT");
            if (event.key === "ArrowUp") changeDirection("UP");
            if (event.key === "ArrowRight") changeDirection("RIGHT");
            if (event.key === "ArrowDown") changeDirection("DOWN");
        });
    } else {
        document.getElementById("upButton").addEventListener("click", () => changeDirection("UP"));
        document.getElementById("downButton").addEventListener("click", () => changeDirection("DOWN"));
        document.getElementById("leftButton").addEventListener("click", () => changeDirection("LEFT"));
        document.getElementById("rightButton").addEventListener("click", () => changeDirection("RIGHT"));
    }
}

function changeDirection(newDirection) {
    if (newDirection === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    if (newDirection === "UP" && direction !== "DOWN") direction = "UP";
    if (newDirection === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
    if (newDirection === "DOWN" && direction !== "UP") direction = "DOWN";
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
    snake = [{ x: 10 * boxSize, y: 10 * boxSize }];
    gameInterval = setInterval(gameLoop, 150);

    generateFood();
    startButton.style.display = "none";
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
    if (headX < 0) headX = canvas.width;
    else if (headX >= canvas.width) headX = 0;
    else if (headY < 0) headY = canvas.height;
    else if (headY >= canvas.height) headY = 0;

    let newHead = { x: headX, y: headY };
    snake.unshift(newHead);

    if (headX === food.x && headY === food.y) {
        score++;
        eatSound.play();
        generateFood();
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.drawImage(mouseImg, food.x, food.y, boxSize, boxSize);

    // Draw snake
    snake.forEach((part, index) => {
        if (index === 0) {
            // Draw snake head
            ctx.drawImage(snakeHeadImg, part.x, part.y, boxSize, boxSize);
        } else {
            // Draw snake body
            ctx.fillStyle = "#8fc43c";
            ctx.beginPath();
            ctx.arc(part.x + boxSize / 2, part.y + boxSize / 2, boxSize / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    });

    // Display score
    ctx.fillStyle = "white";
    ctx.font = 0.3 * boxSize + "px Arial";
    ctx.fillText("Score: " + score, 10, 20 * boxSize - 10);
}

function gameLoop() {
    updateGame();
    draw();
}

function gameOver() {
    music.pause();
    gameOverSound.play();
    
    clearInterval(gameInterval); // Stop game
    alert("Game Over!");

    document.location.reload();
}

// Start game
function startGame() {
    initGame();
}
