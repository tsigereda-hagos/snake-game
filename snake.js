// Basic Snake Game Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const endBtn = document.getElementById('endBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, direction, food, gameOver, gameStarted, gameLoopTimeout;

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = { x: 5, y: 5 };
    gameOver = false;
    gameStarted = false;
    clearTimeout(gameLoopTimeout);
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw snake
    ctx.fillStyle = '#0f0';
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });
    // Draw food
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    // Draw overlay if not started or game over
    if (!gameStarted) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press Start to Play', canvas.width/2, canvas.height/2);
    } else if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
    }
}

function update() {
    if (!gameStarted || gameOver) return;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    // Check wall collision
    if (
        head.x < 0 || head.x >= tileCount ||
        head.y < 0 || head.y >= tileCount ||
        snake.some(part => part.x === head.x && part.y === head.y)
    ) {
        gameOver = true;
        draw();
        return;
    }
    snake.unshift(head);
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        placeFood();
    } else {
        snake.pop();
    }
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // Avoid placing food on the snake
    if (snake.some(part => part.x === food.x && part.y === food.y)) {
        placeFood();
    }
}

document.addEventListener('keydown', e => {
    if (!gameStarted || gameOver) return;
    switch (e.key) {
        case 'ArrowUp': if (direction.y !== 1) direction = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (direction.y !== -1) direction = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (direction.x !== 1) direction = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (direction.x !== -1) direction = { x: 1, y: 0 }; break;
    }
});


function gameLoop() {
    update();
    draw();
    if (gameStarted && !gameOver) {
        gameLoopTimeout = setTimeout(gameLoop, 200); // Slower speed (200ms)
    }
}

startBtn.addEventListener('click', () => {
    if (!gameStarted || gameOver) {
        resetGame();
        direction = { x: 1, y: 0 }; // Start moving right
        gameStarted = true;
        gameOver = false;
        gameLoop();
    }
});

endBtn.addEventListener('click', () => {
    gameOver = true;
    gameStarted = false;
    clearTimeout(gameLoopTimeout);
    draw();
});

// Initialize
resetGame();
