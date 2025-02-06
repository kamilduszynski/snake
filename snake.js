// Get elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

const music = new Audio('assets/arcade_music.mp3');
const eatSound = new Audio('assets/arcade_eat.mp3');
const gameOverSound = new Audio('assets/arcade_gameover.mp3');

// Load images
const snakeHeadImg = new Image();
snakeHeadImg.src = "assets/head.png";

const mouseImg = new Image();
mouseImg.src = "assets/mouse.png";

let box; // Box size (will scale dynamically)
let rows, cols; // Grid dimensions
let snake, food, direction, score, gameInterval;

// Function to resize canvas based on screen size
function resizeCanvas() {
    let screenSize = Math.min(window.innerWidth, window.innerHeight) * 0.7; // 70% of the smaller screen dimension
    screenSize = Math.floor(screenSize / 20) * 20; // Round to nearest multiple of 20 for consistency

    canvas.width = screenSize;
    canvas.height = screenSize;

    box = screenSize / 20; // Scale box size dynamically
    rows = cols = 20; // Keep a 20x20 grid
}

// Call resizeCanvas when the window loads and resizes
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

function checkDevice() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
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

window.onload = checkDevice;

// Initialize game
function initGame() {
    music.play();
    music.loop = true;
    music.volume = 0.05;
    music.playbackRate = 1.25;
    eatSound.playbackRate = 1.25;

    score = 0;
    direction = "RIGHT";
    snake = [{ x: 10 * box, y: 10 * box }];
    gameInterval = setInterval(gameLoop, 100);

    generateFood();
    startButton.style.display = "none";
}

// Generating Food
function generateFood() {
    x = Math.floor(Math.random() * 20) * box;
    y = Math.floor(Math.random() * 20) * box;
    while (snake.some(segment => segment.x === x && segment.y === y)) {
        x = Math.floor(Math.random() * 20) * box;
        y = Math.floor(Math.random() * 20) * box;
    }
    food = {x, y};
}

function updateGame() {
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "UP") headY -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "DOWN") headY += box;

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
    ctx.drawImage(mouseImg, food.x, food.y, box, box);

    // Draw snake
    snake.forEach((part, index) => {
        if (index === 0) {
            // Draw snake head
            ctx.drawImage(snakeHeadImg, part.x, part.y, box, box);
        } else {
            // Draw snake body
            ctx.fillStyle = "#8fc43c";
            ctx.beginPath();
            ctx.arc(part.x + box / 2, part.y + box / 2, box / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    });

    // Display score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function gameLoop() {
    updateGame();
    draw();
}

function gameOver() {
    music.pause();
    gameOverSound.play();
    
    clearInterval(gameInterval); // Stop game
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvas.width / 4, canvas.height / 2);
    alert("Game Over!");
    startButton.style.display = "block";
    document.location.reload();
}

// Start game
function startGame() {
    initGame();
}
