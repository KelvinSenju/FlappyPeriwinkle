//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -1.7;
let velocityY = 0;
let gravity = 0.1;
let jumpStrength = -4;

let gameOver = false;
let score = 0;

// Add a variable to track if the game is paused
let isPaused = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load images
    birdImg = new Image();
    birdImg.src = "./kirby.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 seconds

    document.addEventListener("keydown", moveBird);
    document.addEventListener("touchstart", handleTouch, { passive: true });
    document.addEventListener("click", handleClick);

    // Button event for "Yes, I'll be your girlfriend!"
    document.getElementById("askOutBtn").addEventListener("click", function () {
        alert("Yay! You said yes! ❤️");
        resetGame(); // Optionally reset the game when she says yes.
    });

    // Button event for "Next"
    document.getElementById("nextBtn").addEventListener("click", showNextMessage);
}

let messageStep = 0; // Step counter for the multi-step message

function update() {
    if (isPaused || gameOver) {
        return;
    }

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // Check if the score reaches 15 to pause the game
    if (score >= 15) {
        isPaused = true;
        showMessage(); // Show the message box when paused
        return;
    }

    // Update bird position
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Handle collisions and score updates
    if (bird.y + bird.height > board.height) {
        bird.y = board.height - bird.height;
        gameOver = true;
    }

    // pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function placePipes() {
    if (gameOver || isPaused) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function handleTouch(e) {
    e.preventDefault();
    moveBird();
}

function handleClick(e) {
    moveBird();
}

function moveBird(e) {
    velocityY = jumpStrength;

    if (gameOver) {
        resetGame();
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function showMessage() {
    const messageBox = document.getElementById("messageBox");
    const messageText = document.getElementById("messageText");
    const nextBtn = document.getElementById("nextBtn");

    messageText.innerHTML = "Hello! I hope you enjoyed this web app I made for you. I developed it over the past 4 days. But anyways, I’ve really enjoyed our time together. You’ve made me smile more, taught me so much, and helped me explore areas I never thought I’d go around. Your life is different from mine, and through you, I’ve gotten to experience so many things I’ve always wanted to. Your presence always makes me happy, so much so that even my family noticed how happy I was when you came back from Vietnam.";
    messageBox.style.display = "flex"; // Show the message box

    // Show next button to move to the next step
    nextBtn.style.display = "block";
}

function showNextMessage() {
    const messageText = document.getElementById("messageText");

    messageStep++;
    if (messageStep === 1) {
        messageText.innerHTML = "So with that, I want you to know that I've really enjoyed getting to know you!";
    } else if (messageStep === 2) {
        messageText.innerHTML = "Anyways, it's been so fun, really. I hope that our future stays stable and full of growth. I’m excited to learn more from you and to keep growing together. Soon enough, we’ll finish college, work side by side, and then start a family together. I truly look forward to all of that. It makes me happy whenever we talk about our future and our family. It’s a future I can’t wait to share with you."; 
    } else if (messageStep === 3) {
        messageText.innerHTML = "So now, we should probably go our own ways, let's break up now. Thanks for everything though...";
    } else if (messageStep === 4) {
        messageText.innerHTML = "Just kidding lol. I wanna take our relationship to the next level. I didn’t wanna make it basic by just asking you, so I made this. Anyways, I love you as always. I wanna ask you now, do you want to take it to the next level?";
        document.getElementById("nextBtn").style.display = "none";  // Optionally hide the "Next" button
        document.getElementById("askOutBtn").style.display = "block"; // Show the final button to confirm
    }
}

function resetGame() {
    bird.y = birdY;
    velocityY = 0;
    pipeArray = [];
    score = 0;
    gameOver = false;
    isPaused = false;
    messageStep = 0; // Reset message step
    const messageBox = document.getElementById("messageBox");
    messageBox.style.display = "none"; // Hide the message box
}
