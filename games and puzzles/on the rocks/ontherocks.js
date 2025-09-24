const canvas = document.getElementById('gameCanvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

// --- Player ---
const player = {
  x: 30,
  y: canvas.height - 60,
  width: 40,
  height: 40,
  color: 'lime',
  speed: 8
};

// --- Platforms ---
const platforms = [
  { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 }
];

// --- Falling rocks ---
const rocks = [];

function initRocks() {
  rocks.length = 0; // clear previous rocks if any
  const initialRocks = 20; // more rocks for difficulty

  for (let i = 0; i < initialRocks; i++) {
    const x = Math.random() * (canvas.width - 2*safeZoneWidth - 30) + safeZoneWidth;
    const y = Math.random() * canvas.height; // anywhere on screen
    const speed = rockSpeedRange[0] + Math.random() * (rockSpeedRange[1]-rockSpeedRange[0]);
    rocks.push({
      x,
      y,
      width: 30,
      height: 30,
      speed,
      color: 'gray'
    });
  }
}



const safeZoneWidth = 80;

let difficulty = prompt("Choose difficulty: easy, medium, hard, impossible").toLowerCase();
let spawnRate, rockSpeedRange;

switch(difficulty) {
    case 'easy':
        spawnRate = 0.2; // 1% chance per frame
        rockSpeedRange = [3, 4];
        initRocks();
        break;
    case 'medium':
        spawnRate = 0.3;
        rockSpeedRange = [4, 7];
        initRocks();
        break;
    case 'hard':
        spawnRate = 0.4;
        rockSpeedRange = [5, 10];
        initRocks();
        break;
    case 'impossible':
        spawnRate = 0.7;
        rockSpeedRange = [9, 10];
        initRocks();
        break;
    default:
        spawnRate = 0.3;
        rockSpeedRange = [4, 7];
        initRocks();
}

function spawnRock() {
   const x = Math.random() * (canvas.width - 2 * safeZoneWidth - 30) + safeZoneWidth;
  rocks.push({
    x: x,
    y: -30,
    width: 30,
    height: 30,
    speed: rockSpeedRange[0] + Math.random() * (rockSpeedRange[1]-rockSpeedRange[0]),
    color: 'gray'
  });
}


// --- Controls ---
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// --- Collision ---
function rectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// --- Game Loop ---
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0,0,canvas.width,canvas.height);

  // Move player
  if(keys['ArrowLeft']) player.x -= player.speed;
  if(keys['ArrowRight']) player.x += player.speed;

  // Keep player on canvas
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  // Draw platforms
  platforms.forEach(p => {
    c.fillStyle = 'brown';
    c.fillRect(p.x, p.y, p.width, p.height);
  });

  // Spawn rocks randomly
  if(Math.random() < spawnRate) spawnRock();

  // Update rocks
  for(let i = rocks.length-1; i >= 0; i--) {
    const rock = rocks[i];
    rock.y += rock.speed;
    c.fillStyle = rock.color;
    c.fillRect(rock.x, rock.y, rock.width, rock.height);

    // Collision with player
    if(rectCollision(rock, player)) {
      player.x = 30;
      player.y = canvas.height - 60;
    }

    // Remove offscreen rocks
    if(rock.y > canvas.height) rocks.splice(i,1);
  }

  // Draw player
  c.fillStyle = player.color;
  c.fillRect(player.x, player.y, player.width, player.height);

  // Check if player reached right side
  if(player.x + player.width >= canvas.width-10) {
    alert('Welcom to On The Rocks Tavern!\nYou made it safely across!\nCare for a drink?');
    player.x = 50;
    player.y = canvas.height - 60;
  }
}

animate();