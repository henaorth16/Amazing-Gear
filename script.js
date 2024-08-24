//board
let announce = document.querySelector(".gameover")
let board;
let boardWidth = 360;
let boardHeight = 600;
let context;

//gear
let gearWidth = 40;
let gearHeight = 40;
let gearX = boardWidth / 2;
let gearY = boardHeight / 1.8;
let gearImg;

let gear = {
  x: gearX - gearWidth / 2,
  y: gearY,
  width: gearWidth,
  height: gearHeight,
};

//draw_walls
let blockArr = [];
let blockWidth = boardWidth;
let blockHeight = 45;
let blockX = 0;
let blockY = blockHeight * -1;

let rightblockImg;
let leftblockImg;

//physics
let velocityY = 2; // the blocks movind down speed
let velocityJump = 0;
let gravity = 0.4;
let velocityLeft = 0;

let gameOver = false;
let score = 0;
let highScore = 0
window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //this allows us to draw on the board

 
  gearImg = new Image();
  gearImg.src = "./gear.webp";
  gearImg.onload = function () {
    context.drawImage(gearImg, gear.x, gear.y, gear.width, gear.height);
  };
  gear.x += velocityLeft;
  requestAnimationFrame(update);
  setInterval(placeblocks, 2300);
  document.addEventListener("keydown", moveGear);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    announce.style.display="block"
    updateHighScore()
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //gear

  velocityJump += gravity;
  velocityLeft *= gravity * 2.455;
  gear.y += velocityJump;
  gear.x += velocityLeft;
  gear.x = Math.max(gear.x + velocityLeft, 0);
  gear.x = Math.min(gear.x - velocityLeft, boardWidth - gearWidth);

  context.drawImage(gearImg, gear.x, gear.y, gear.width, gear.height);

  if (gear.y >= board.height - gearHeight || gear.y <= 0) {
    gameOver = true;
  }
  // blocks

  for (let i = 0; i < blockArr.length; i++) {
    const block = blockArr[i];
    block.y += velocityY * 1.5;
    context.fillStyle = "#006563";
    context.fillRect(block.x, block.y, block.width, block.height);
    if (!block.passed && gear.y < block.y) {
      score += 0.5;
      block.passed = true;
    }
    if (detectCollusion(gear, block)) {
      gameOver = true;
    }
  }
  while (blockArr.length > 0 && blockArr[0].y > boardHeight) {
    blockArr.shift()
  }
  context.fillStyle = "black";
  context.font = "20px sans-serif";
  context.fillText(score, 10, 27);
 highScore = localStorage.getItem("highScore")
  gameOver && context.fillText(`Game Over      High Score ${Math.max(highScore, score)}`, 10, 63);
}



function placeblocks() {
  let max = blockX - (blockWidth - 50);
  let min = blockX - 84;

  let ramdomblockX = Math.random() * (max - min) + min;
  let openingSpace = (boardWidth - 150) / 4.9 / (velocityY / 5); // the opening space becomes narrow and narrow

  let rightblock = {
    x: ramdomblockX,
    y: blockY,
    width: blockWidth,
    height: blockHeight,
    passed: false,
  };
  velocityY *= 1.007;

  blockArr.push(rightblock);
  let leftblock = {
    x: ramdomblockX + blockWidth + openingSpace,
    y: blockY,
    width: blockWidth,
    height: blockHeight,
    passed: false,
  };
  blockArr.push(leftblock);
}

function moveGear(e) {
  if (e.code == "ArrowLeft") {
    velocityLeft = -2;
    velocityJump = -6;
  } else if (e.code == "ArrowRight") {
    velocityLeft = 2;
    velocityJump = -6;
  }else if (e.code == "ArrowUp") {
    velocityJump = -6;
  }else if(e.code == "Space"){
    gameOver ? gameOvercheck() : "";
  }
}

function detectCollusion(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
function gameOvercheck() {
  announce.style.display = "none"
  gear.x = gearX;
  gear.y = gearY;
  blockArr = [];
  score = 0;
  velocityY = 2; // the blocks moving down speed
  velocityJump = 0;
  gravity = 0.4;
  velocityLeft = 0;
  gameOver = false;
}

function updateHighScore() {
  const currentHighScore = highScore || 0;
  
  if (score > currentHighScore) {
    localStorage.setItem('highScore', score);
    console.log(`New high score: ${score}`);
  } else {
    console.log(`High score remains: ${currentHighScore}`);
  }
}
