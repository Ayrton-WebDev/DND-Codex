const bg = document.getElementById("bg");
const fg = document.getElementById("fg");
const bgCtx = bg.getContext("2d");
const fgCtx = fg.getContext("2d");

// --- players & words ---
const players = ["Tyler", "Niamh", "Gareth", "Kat", "Artis", "Jarren", "Kyle"]; 
const words = ["REVEAL", "THYSELF", "DEMON", "INTO", "THE", "SHADOW", "WORLD"];

// prompt player name
let playerName = prompt("Enter your name:");
let playerIndex = players.indexOf(playerName);

// fallback if name not found
if (playerIndex === -1) {
  alert("Name not recognized. Defaulting to first word.");
  playerIndex = 0;
}

const myWord = words[playerIndex % words.length];

function resize() {
  bg.width = fg.width = innerWidth;
  bg.height = fg.height = innerHeight;
  drawBackground();
}
window.addEventListener("resize", resize);
resize();

// --- draw one word's letters scattered ---
function drawBackground() {
  bgCtx.fillStyle = "blue";
  bgCtx.fillRect(0, 0, bg.width, bg.height);

  bgCtx.font = "48px sans-serif";
  bgCtx.textAlign = "center";
  bgCtx.textBaseline = "middle";

  const placedLetters = [];
  const fontSize = 48;
  const margin = 50;

  bgCtx.fillStyle = "white";
  for (let i = 0; i < myWord.length; i++) {
    let x, y, width, box;
    let tries = 0;

    do {
      x = Math.random() * (bg.width - 2 * margin) + margin;
      y = Math.random() * (bg.height - 2 * margin) + margin;

      width = bgCtx.measureText(myWord[i]).width;
      box = { x: x - width / 2, y: y - fontSize / 2, w: width, h: fontSize };

      tries++;
      if (tries > 500) break;
    } while (placedLetters.some(l =>
      !(box.x + box.w < l.x || l.x + l.w < box.x || box.y + box.h < l.y || l.y + l.h < box.y)
    ));

    placedLetters.push(box);
    bgCtx.fillText(myWord[i], x, y);
  }
}

// --- pointer position ---
const pointer = {x:innerWidth/2,y:innerHeight/2};
window.addEventListener("mousemove", e=>{
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});

// --- overlay torchlight effect ---
function drawOverlay() {
  fgCtx.clearRect(0,0,fg.width,fg.height);

  fgCtx.fillStyle = "black";
  fgCtx.fillRect(0,0,fg.width,fg.height);

  fgCtx.globalCompositeOperation = "destination-out";
  fgCtx.beginPath();
  fgCtx.arc(pointer.x, pointer.y, 150, 0, Math.PI*2);
  fgCtx.fill();

  fgCtx.globalCompositeOperation = "source-over";
}

function loop() {
  drawOverlay();
  requestAnimationFrame(loop);
}
loop();
