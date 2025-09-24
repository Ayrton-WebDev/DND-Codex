const bg = document.getElementById("bg");
const fg = document.getElementById("fg");
const bgCtx = bg.getContext("2d");
const fgCtx = fg.getContext("2d");

function resize() {
  bg.width = fg.width = innerWidth;
  bg.height = fg.height = innerHeight;
  drawBackground();
}
window.addEventListener("resize", resize);
resize();

// --- draw some letters/images on background ---
function drawBackground() {
  // fill whole background with blue
  bgCtx.fillStyle = "blue";
  bgCtx.fillRect(0, 0, bg.width, bg.height);

  bgCtx.font = "48px sans-serif";
  bgCtx.textAlign = "center";
  bgCtx.textBaseline = "middle";

  const words = ["REVEAL", "THYSELF", "DEMON"];
  const colours = ["white", "yellow", "red"];

  const placedLetters = [];
  const fontSize = 48;
  const margin = 50;

  words.forEach((word, wIndex) => {
    bgCtx.fillStyle = colours[wIndex % colours.length];

    for (let i = 0; i < word.length; i++) {
      let x, y, width, box;
      // keep trying until no overlap
      let tries = 0;
      do {
        x = Math.random() * (bg.width - 2 * margin) + margin;
        y = Math.random() * (bg.height - 2 * margin) + margin;

        width = bgCtx.measureText(word[i]).width;
        box = { x: x - width / 2, y: y - fontSize / 2, w: width, h: fontSize };

        tries++;
        if (tries > 500) break; // failsafe to avoid infinite loop
      } while (placedLetters.some(l =>
        !(box.x + box.w < l.x || l.x + l.w < box.x || box.y + box.h < l.y || l.y + l.h < box.y)
      ));

      placedLetters.push(box);
      bgCtx.fillText(word[i], x, y);
    }
  });
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

  // dark layer
  fgCtx.fillStyle = "black";
  fgCtx.fillRect(0,0,fg.width,fg.height);

  // cut a circular hole where the mouse is
  fgCtx.globalCompositeOperation = "destination-out";
  fgCtx.beginPath();
  fgCtx.arc(pointer.x,pointer.y,150,0,Math.PI*2);
  fgCtx.fill();

  // reset for next frame
  fgCtx.globalCompositeOperation = "source-over";
}

function loop() {
  drawOverlay();
  requestAnimationFrame(loop);
}
loop();