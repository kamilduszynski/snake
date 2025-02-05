// Get elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

const box = 30;
const radius = 15;
let snake, food, direction, score, gameInterval;

// Load images
const snakeHeadImg = new Image();
snakeHeadImg.src = "assets/head.png";

const mouseImg = new Image();
mouseImg.src = "assets/mouse.png";

// Initialize game
function initGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    direction = "RIGHT";
    score = 0;
    
    gameInterval = setInterval(gameLoop, 100);
    startButton.style.display = "none"; // Hide button
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (key === 38 && direction !== "DOWN") direction = "UP";
    else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (key === 40 && direction !== "UP") direction = "DOWN";
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
        food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
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
            ctx.fillStyle = "#48c048";
            ctx.fillRect(part.x, part.y, box, box);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "white";
            ctx.strokeRect(part.x, part.y, box, box);
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
    clearInterval(gameInterval); // Stop game
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvas.width / 4, canvas.height / 2);
    alert("Game Over!");
    startButton.style.display = "block"; // Show button
    document.location.reload();
}

// start game
function startGame() {
    initGame(); // start game variables
}
