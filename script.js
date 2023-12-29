//board

let board;
let boardWidth = 360;
let boardHeight = 620;
let context;

//gear
let gearWidth = 40;
let gearHeight = 40;
let gearX = boardWidth / 2;
let gearY = boardHeight / 1.5;
let gearImg;

let gear = {
  x: gearX - gearWidth / 2,
  y: gearY,
  width: gearWidth,
  height: gearHeight,
};

//draw_walls
let pipeArr = [];
let pipeWidth = boardWidth;
let pipeHeight = 45;
let pipeX = 0;
let pipeY = pipeHeight * -1;

let rightPipeImg;
let leftPipeImg;

//physics
let velocityY = 2; // the pipes movind down speed
let velocityJump = 0;
let gravity = 0.4;
let velocityLeft = 0;

let gameOver = false;
let score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //this allows us to draw on the board

  //draw the gear
  //   context.fillStyle = "black";
  //   context.fillRect(gear.x, gear.y, gear.width, gear.height);

  gearImg = new Image();
  gearImg.src = "./gear.webp";
  gearImg.onload = function () {
    context.drawImage(gearImg, gear.x, gear.y, gear.width, gear.height);
  };
  gear.x += velocityLeft;
  requestAnimationFrame(update);
  setInterval(placePipes, 2300);
  document.addEventListener("keydown", moveGear);
  document.addEventListener("click", moveGear);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
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

  if (gear.y > board.height) {
    gameOver = true;
  }
  // pipes

  for (let i = 0; i < pipeArr.length; i++) {
    const pipe = pipeArr[i];
    pipe.y += velocityY * 1.5;
    context.fillStyle = "#006563";
    context.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    if (!pipe.passed && gear.y < pipe.y) {
      score += 0.5;
      pipe.passed = true;
    }
    if (detectCollusion(gear, pipe)) {
      gameOver = true;
    }
  }
  while (pipeArr.length > 0 && pipeArr[0].y > boardHeight) {
    pipeArr.shift()
  }
  console.log(pipeArr);
  context.fillStyle = "black";
  context.font = "30px sans-serif";
  context.fillText(score, 9, 33);

  gameOver ? context.fillText("Game Over", 10, 63) : "";
}

function placePipes() {
  let max = pipeX - (pipeWidth - 50);
  let min = pipeX - 84;

  let ramdomPipeX = Math.random() * (max - min) + min;
  let openingSpace = (boardWidth - 150) / 4.9 / (velocityY / 5);

  let rightPipe = {
    x: ramdomPipeX,
    y: pipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  velocityY *= 1.007;

  pipeArr.push(rightPipe);
  let leftPipe = {
    x: ramdomPipeX + pipeWidth + openingSpace,
    y: pipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArr.push(leftPipe);
}

function moveGear(e) {
  if (e.code == "ArrowLeft" || e.clientX <= window.innerHeight / 2) {
    velocityLeft = -2;
    velocityJump = -6;
    gameOver ? gameOvercheck() : "";
  } else if (e.code == "ArrowRight" || e.clientX > window.innerWidth / 2) {
    velocityLeft = 2;
    velocityJump = -6;
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
  gear.x = gearX;
  gear.y = gearY;
  pipeArr = [];
  score = 0;
  velocityY = 2; // the pipes movind down speed
  velocityJump = 0;
  gravity = 0.4;
  velocityLeft = 0;
  gameOver = false;
}
