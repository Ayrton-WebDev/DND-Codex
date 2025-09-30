const canvas = document.getElementById("fireballGame");
const ctx = canvas.getContext("2d");

const lanes = 3;               // can be changed to 5
let laneWidth = canvas.width / lanes;
let playerLane = 1;            // start in the middle lane
let fireballs = [];
let speed = 2;                 // starting speed
let score = 0;
let gameOver = false;

// Player size
const player = {
  w: 40,
  h: 40,
  y: canvas.height - 60
};

// Input
document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  if (e.key === "ArrowLeft" && playerLane > 0) playerLane--;
  if (e.key === "ArrowRight" && playerLane < lanes - 1) playerLane++;
});

// Spawn fireballs
let previousSafeLanes = [0, 1, 2]; // start with all lanes safe

function spawnRow() {
  let balls = [];

  // pick lanes that are safe in the previous row
  let possibleLanes = [...Array(lanes).keys()]; // [0,1,2]
  
  // exclude lane if it would block all safe paths
  if (previousSafeLanes.length === 1) {
    // always keep the previous safe lane open
    possibleLanes = possibleLanes.filter(l => l !== previousSafeLanes[0]);
  }

  // number of fireballs: 1–(lanes-1)
  let fireballCount = Math.floor(Math.random() * (lanes - 1)) + 1;

  let chosen = [];
  while (chosen.length < fireballCount) {
    let lane = possibleLanes[Math.floor(Math.random() * possibleLanes.length)];
    if (!chosen.includes(lane)) {
      chosen.push(lane);
      balls.push({ lane, y: -40 });
    }
  }

  // update previousSafeLanes
  previousSafeLanes = [];
  for (let l = 0; l < lanes; l++) {
    if (!chosen.includes(l)) previousSafeLanes.push(l);
  }

  fireballs.push(balls);
}


// Draw lanes
function drawLanes() {
  ctx.strokeStyle = "#aaa";
  ctx.lineWidth = 2;
  for (let i = 1; i < lanes; i++) {
    let x = i * laneWidth;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
}

// Draw safety line
function drawSafetyLine() {
  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, player.y + player.h);
  ctx.lineTo(canvas.width, player.y + player.h);
  ctx.stroke();
}

// Draw player
function drawPlayer() {
  ctx.fillStyle = "blue";
  let x = playerLane * laneWidth + laneWidth / 2 - player.w / 2;
  ctx.fillRect(x, player.y, player.w, player.h);
}

// Draw fireballs
function drawFireballs() {
  ctx.fillStyle = "red";
  fireballs.forEach(row => {
    row.forEach(ball => {
      let x = ball.lane * laneWidth + laneWidth / 2 - 20;
      ctx.beginPath();
      ctx.arc(x + 20, ball.y + 20, 20, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

// Update fireballs
let frame = 0;
let spawnRate = 80;          // start slow
const minSpawnRate = 30;     // don’t go too crazy
const minGap = 70;          // pixels between rows

function canSpawn() {
  if (fireballs.length === 0) return true;
  let lastRow = fireballs[fireballs.length - 1];
  // y starts at -40, each ball has radius 20 → bottom = y + 40
  return lastRow[0].y + 40 > minGap;
}

function updateFireballs() {
  fireballs.forEach(row => row.forEach(ball => ball.y += speed));

  // Remove rows that go off screen and increase score
  if (fireballs.length > 0 && fireballs[0][0].y > canvas.height) {
    fireballs.shift();
    score++;

    if (score % 1 === 0) {
      speed += 0.25; // increase speed
      if (spawnRate > minSpawnRate) spawnRate -= 5; // increase spawn frequency
    }
  }
}

// Collision detection
function checkCollision() {
  fireballs.forEach(row => {
    row.forEach(ball => {
      if (
        ball.lane === playerLane &&
        ball.y + 40 > player.y &&
        ball.y < player.y + player.h
      ) {
        gameOver = true;
      }
    });
  });
}

// Game loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    // spawn new row only if timing AND spacing allow
    if (frame % spawnRate === 0 && canSpawn()) {
      spawnRow();
    }

    drawLanes();
    drawSafetyLine();
    drawPlayer();
    drawFireballs();
    updateFireballs();
    checkCollision();

    frame++;
  } else {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2-50);
   ctx.fillText(`Score: ${score}`, canvas.width / 2 - 100, canvas.height / 2+50);

  }

  // Score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(loop);
}

loop();
