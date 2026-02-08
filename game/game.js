// Game configuration
const CONFIG = {
    gridSize: 64,
    gameSpeed: 150, // milliseconds between moves
    canvasSize: 640
};

// Image assets - replace these paths with your own images
const prefix = (typeof ASSET_PREFIX !== 'undefined') ? ASSET_PREFIX : '';
const ASSETS = {
    snakeHead: prefix + 'head.png',
    snakeBody: prefix + 'torso.png',
    snakeTail: prefix + 'butt.png',
    food: prefix + 'sock.png'
};

// Game state
let canvas, ctx;
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop = null;
let isPaused = false;
let imagesLoaded = false;

// Image objects
const images = {
    head: new Image(),
    body: new Image(),
    tail: new Image(),
    food: new Image()
};

// Initialize the game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    document.getElementById('high-score').textContent = highScore;

    // Set up event listeners
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.addEventListener('keydown', handleKeyPress);

    // Load images
    loadImages();

    // Draw initial screen
    drawStartScreen();

    // Start real-time leaderboard listener (if available)
    if (typeof Leaderboard !== 'undefined') {
        Leaderboard.startListening();
    }
}

// Load custom images with fallback to colored rectangles
function loadImages() {
    let loadedCount = 0;
    const totalImages = 4;

    const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
            imagesLoaded = true;
            console.log('All images loaded successfully!');
        }
    };

    const handleError = (imgName) => {
        console.log(`Could not load ${imgName} image, using fallback colors`);
        checkAllLoaded();
    };

    images.head.onload = checkAllLoaded;
    images.head.onerror = () => handleError('head');
    images.head.src = ASSETS.snakeHead;

    images.body.onload = checkAllLoaded;
    images.body.onerror = () => handleError('body');
    images.body.src = ASSETS.snakeBody;

    images.tail.onload = checkAllLoaded;
    images.tail.onerror = () => handleError('tail');
    images.tail.src = ASSETS.snakeTail;

    images.food.onload = checkAllLoaded;
    images.food.onerror = () => handleError('food');
    images.food.src = ASSETS.food;
}

// Draw start screen
function drawStartScreen() {
    ctx.fillStyle = '#fffef9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#3d3d3d';
    ctx.font = '28px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('Press Start', canvas.width / 2, canvas.height / 2);

    ctx.font = 'italic 16px Georgia';
    ctx.fillStyle = '#888';
    ctx.fillText('Use arrow keys or WASD', canvas.width / 2, canvas.height / 2 + 35);
}

// Start the game
let countdownTimer = null;

function startGame() {
    // Reset game state
    snake = [
        { x: 4, y: 5 },
        { x: 3, y: 5 },
        { x: 2, y: 5 }
    ];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    isPaused = false;

    document.getElementById('score').textContent = score;
    document.getElementById('startBtn').textContent = 'Restart';
    document.getElementById('startBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('pauseBtn').textContent = 'Pause';

    spawnFood();

    // Clear any existing game loop or countdown
    if (gameLoop) clearInterval(gameLoop);
    if (countdownTimer) clearInterval(countdownTimer);

    // Draw the board once so player can see initial state
    draw();

    // 3-2-1 countdown
    var count = 3;
    drawCountdown(count);
    countdownTimer = setInterval(function () {
        count--;
        if (count > 0) {
            draw();
            drawCountdown(count);
        } else {
            clearInterval(countdownTimer);
            countdownTimer = null;
            document.getElementById('startBtn').disabled = false;
            document.getElementById('pauseBtn').disabled = false;
            gameLoop = setInterval(gameUpdate, CONFIG.gameSpeed);
        }
    }, 750);
}

function drawCountdown(num) {
    ctx.fillStyle = 'rgba(255, 254, 249, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#3d3d3d';
    ctx.font = 'bold 80px Georgia';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(num, canvas.width / 2, canvas.height / 2);
    ctx.textBaseline = 'alphabetic';
}

// Toggle pause
function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pauseBtn').textContent = isPaused ? 'Resume' : 'Pause';

    if (isPaused) {
        drawPauseScreen();
    }
}

// Draw pause screen overlay
function drawPauseScreen() {
    ctx.fillStyle = 'rgba(255, 254, 249, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#3d3d3d';
    ctx.font = '28px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
}

// Handle keyboard input
function handleKeyPress(e) {
    // Don't intercept keys when the score modal is open
    var modal = document.getElementById('score-modal');
    if (modal && modal.style.display === 'flex') return;

    const key = e.key.toLowerCase();

    // Prevent default for arrow keys to stop page scrolling
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
        e.preventDefault();
    }

    switch (key) {
        case 'arrowup':
        case 'w':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'arrowdown':
        case 's':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'arrowleft':
        case 'a':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'arrowright':
        case 'd':
            if (direction !== 'left') nextDirection = 'right';
            break;
        case ' ':
            if (gameLoop) togglePause();
            break;
    }
}

// Spawn food at random location
function spawnFood() {
    const gridCount = CONFIG.canvasSize / CONFIG.gridSize;

    do {
        food = {
            x: Math.floor(Math.random() * gridCount),
            y: Math.floor(Math.random() * gridCount)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

// Main game update loop
function gameUpdate() {
    if (isPaused) return;

    direction = nextDirection;

    // Calculate new head position
    const head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Check wall collision
    const gridCount = CONFIG.canvasSize / CONFIG.gridSize;
    if (head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount) {
        gameOver();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Add new head
    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        spawnFood();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }

    // Draw the game
    draw();
}

// Draw game elements
function draw() {
    const cellSize = CONFIG.gridSize;

    // Clear canvas
    ctx.fillStyle = '#fffef9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    drawFood();

    // Draw snake
    snake.forEach((segment, index) => {
        drawSnakeSegment(segment, index);
    });
}

// Draw a snake segment with appropriate image or fallback
function drawSnakeSegment(segment, index) {
    const x = segment.x * CONFIG.gridSize;
    const y = segment.y * CONFIG.gridSize;
    const size = CONFIG.gridSize;
    const padding = 1;

    // Determine which image to use
    let image;
    let fallbackColor;

    if (index === 0) {
        image = images.head;
        fallbackColor = '#3d3d3d';
    } else if (index === snake.length - 1) {
        image = images.tail;
        fallbackColor = '#6a6a6a';
    } else {
        image = images.body;
        fallbackColor = '#5a5a5a';
    }

    // Try to draw image, fallback to colored rectangle
    if (image.complete && image.naturalWidth > 0) {
        // Calculate rotation based on direction for head
        ctx.save();
        ctx.translate(x + size / 2, y + size / 2);

        if (index === 0) {
            // Rotate head based on direction
            let rotation = 0;
            switch (direction) {
                case 'up': rotation = -Math.PI / 2; break;
                case 'down': rotation = Math.PI / 2; break;
                case 'left': rotation = Math.PI; break;
                case 'right': rotation = 0; break;
            }
            ctx.rotate(rotation);
        } else if (index === snake.length - 1 && snake.length > 1) {
            // Rotate tail based on previous segment
            const prev = snake[index - 1];
            const curr = segment;
            let rotation = 0;
            if (prev.y < curr.y) rotation = -Math.PI / 2;
            else if (prev.y > curr.y) rotation = Math.PI / 2;
            else if (prev.x < curr.x) rotation = Math.PI;
            else rotation = 0;
            ctx.rotate(rotation);
        }

        ctx.drawImage(image, -size / 2 + padding, -size / 2 + padding, size - padding * 2, size - padding * 2);
        ctx.restore();
    } else {
        // Fallback: draw colored rectangle with rounded corners
        ctx.fillStyle = fallbackColor;
        roundRect(ctx, x + padding, y + padding, size - padding * 2, size - padding * 2, 4);
        ctx.fill();

        // Add eyes to head
        if (index === 0) {
            ctx.fillStyle = '#fff';
            const eyeSize = 4;
            const eyeOffset = 5;

            switch (direction) {
                case 'right':
                    ctx.beginPath();
                    ctx.arc(x + size - eyeOffset, y + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.arc(x + size - eyeOffset, y + size - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'left':
                    ctx.beginPath();
                    ctx.arc(x + eyeOffset, y + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.arc(x + eyeOffset, y + size - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'up':
                    ctx.beginPath();
                    ctx.arc(x + eyeOffset, y + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.arc(x + size - eyeOffset, y + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'down':
                    ctx.beginPath();
                    ctx.arc(x + eyeOffset, y + size - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.arc(x + size - eyeOffset, y + size - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
            }
        }
    }
}

// Draw food with image or fallback
function drawFood() {
    const x = food.x * CONFIG.gridSize;
    const y = food.y * CONFIG.gridSize;
    const size = CONFIG.gridSize;
    const padding = 2;

    if (images.food.complete && images.food.naturalWidth > 0) {
        ctx.drawImage(images.food, x + padding, y + padding, size - padding * 2, size - padding * 2);
    } else {
        // Fallback: draw simple circle
        ctx.fillStyle = '#3d3d3d';
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, (size - padding * 2) / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Helper function to draw rounded rectangles
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Game over
function gameOver() {
    clearInterval(gameLoop);
    gameLoop = null;

    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('high-score').textContent = highScore;
    }

    // Draw game over screen
    ctx.fillStyle = 'rgba(255, 254, 249, 0.92)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#3d3d3d';
    ctx.font = '32px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = '#5a5a5a';
    ctx.font = '20px Georgia';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

    if (score === highScore && score > 0) {
        ctx.fillStyle = '#3d3d3d';
        ctx.font = 'italic 16px Georgia';
        ctx.fillText('New high score', canvas.width / 2, canvas.height / 2 + 50);
    }

    document.getElementById('pauseBtn').disabled = true;

    // Show score submission modal if score > 0
    if (score > 0 && typeof showScoreModal === 'function') {
        showScoreModal(score);
    }
}

// Score submission modal
function showScoreModal(finalScore) {
    var overlay = document.getElementById('score-modal');
    var scoreDisplay = document.getElementById('modal-score');
    var nameInput = document.getElementById('player-name');
    var form = document.getElementById('score-form');
    var dismissBtn = document.getElementById('score-dismiss');

    if (!overlay || !form) return;

    scoreDisplay.textContent = finalScore;
    overlay.style.display = 'flex';
    nameInput.value = '';
    nameInput.focus();

    function handleSubmit(e) {
        e.preventDefault();
        var name = nameInput.value.trim();
        if (!name) {
            nameInput.focus();
            return;
        }

        var submitBtn = form.querySelector('.score-submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        Leaderboard.submitScore(name, finalScore)
            .then(function () {
                hideModal();
            })
            .catch(function (err) {
                console.error('Score submission failed:', err);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Score';
            });
    }

    function handleDismiss() {
        hideModal();
    }

    function handleKeydown(e) {
        if (e.key === 'Escape') {
            hideModal();
        }
    }

    function hideModal() {
        overlay.style.display = 'none';
        form.removeEventListener('submit', handleSubmit);
        dismissBtn.removeEventListener('click', handleDismiss);
        document.removeEventListener('keydown', handleKeydown);
        var submitBtn = form.querySelector('.score-submit-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Score';
    }

    form.addEventListener('submit', handleSubmit);
    dismissBtn.addEventListener('click', handleDismiss);
    document.addEventListener('keydown', handleKeydown);
}

// Start when page loads
window.addEventListener('load', init);
