// Get elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

const box = 20;
let snake, food, direction, score, gameInterval;

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

    // Check for collisions with walls or itself
    if (headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height || 
        snake.some(segment => segment.x === headX && segment.y === headY)) {
        gameOver();
        return;
    }

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
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Draw snake
    ctx.fillStyle = "lime";
    snake.forEach((part, index) => {
        ctx.fillRect(part.x, part.y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(part.x, part.y, box, box);
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
