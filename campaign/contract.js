(() => {
  const container = document.querySelector(".contract-container");
  const canvasTrail = document.getElementById("ghostTrail");
  const canvasFaces = document.getElementById("ghostFaces");
  const ctxTrail = canvasTrail.getContext("2d");
  const ctxFaces = canvasFaces.getContext("2d");
  const DPR = window.devicePixelRatio || 1;

  let width, height;

  function resize() {
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    [canvasTrail, canvasFaces].forEach(c => {
      c.width = width * DPR;
      c.height = height * DPR;
      const ctx = c.getContext("2d");
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    });
  }
  resize();
  window.addEventListener("resize", resize);

  const faceImages = {
    pain: "../images/pain.png",
    pain2: "../images/pain2.png",
    pain3: "../images/pain3.png",
    scream: "../images/scream.png",
    teethgrit: "../images/teeth-grit.png"
  };
  const faceKeys = Object.keys(faceImages);
  const loadedImages = {};
  faceKeys.forEach(key => {
    const img = new Image();
    img.src = faceImages[key];
    loadedImages[key] = img;
  });

  const GHOST_COUNT = 100;
  const MIN_SIZE = 40;
  const MAX_SIZE = 80;
  const BASE_SPEED = 0.3; // fixed constant speed
  const VERTICAL_SCALE = 1.4;

  class Ghost {
    constructor() {
      this.size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
      this.x = Math.random() * width;
      this.y = Math.random() * height;

      const angle = Math.random() * Math.PI * 2;
      const speed = BASE_SPEED * (this.size / MAX_SIZE);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.speed = speed; // store base speed

      this.alpha = Math.random() * 0.05 + 0.05;
      this.faceType = faceKeys[Math.floor(Math.random() * faceKeys.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      const rX = this.size * 0.9;
      const rY = this.size * VERTICAL_SCALE;
      const marginX = 35;
      const marginY = 25;

      // Bounce off edges (invert velocity, not add)
      if (this.x < rX + marginX) {
        this.x = rX + marginX;
        this.vx = Math.abs(this.vx);
      } else if (this.x > width - rX - marginX) {
        this.x = width - rX - marginX;
        this.vx = -Math.abs(this.vx);
      }

      if (this.y < rY + marginY) {
        this.y = rY + marginY;
        this.vy = Math.abs(this.vy);
      } else if (this.y > height - rY - marginY) {
        this.y = height - rY - marginY;
        this.vy = -Math.abs(this.vy);
      }

      // Slight wandering, but normalize to keep constant speed
      this.vx += (Math.random() - 0.5) * 0.01;
      this.vy += (Math.random() - 0.5) * 0.01;

      const len = Math.hypot(this.vx, this.vy);
      this.vx = (this.vx / len) * this.speed;
      this.vy = (this.vy / len) * this.speed;
    }

    draw(ctx) {
      const img = loadedImages[this.faceType];
      if (!img.complete) return;

      const r = this.size;
      const imgW = r * 1.6;
      const imgH = r * 1.6 * VERTICAL_SCALE;

      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.drawImage(img, this.x - imgW / 2, this.y - imgH / 2, imgW, imgH);
      ctx.restore();
    }
  }

  const ghosts = Array.from({ length: GHOST_COUNT }, () => new Ghost());

  function handleGhostCollisions() {
    for (let i = 0; i < ghosts.length; i++) {
      for (let j = i + 1; j < ghosts.length; j++) {
        const g1 = ghosts[i];
        const g2 = ghosts[j];
        const dx = g2.x - g1.x;
        const dy = (g2.y - g1.y) / VERTICAL_SCALE;
        const dist = Math.hypot(dx, dy);
        const minDist = (g1.size + g2.size) * 0.65;

        if (dist < minDist && dist > 0) {
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = minDist - dist;

          // separate them without changing speed
          g1.x -= nx * overlap * 0.5;
          g1.y -= ny * overlap * 0.5 * VERTICAL_SCALE;
          g2.x += nx * overlap * 0.5;
          g2.y += ny * overlap * 0.5 * VERTICAL_SCALE;

          // simple deflection: swap velocity directions
          const tempVx = g1.vx;
          const tempVy = g1.vy;
          g1.vx = g2.vx;
          g1.vy = g2.vy;
          g2.vx = tempVx;
          g2.vy = tempVy;

          // re-normalize speeds so they never gain/lose energy
          const len1 = Math.hypot(g1.vx, g1.vy);
          const len2 = Math.hypot(g2.vx, g2.vy);
          g1.vx = (g1.vx / len1) * g1.speed;
          g1.vy = (g1.vy / len1) * g1.speed;
          g2.vx = (g2.vx / len2) * g2.speed;
          g2.vy = (g2.vy / len2) * g2.speed;
        }
      }
    }
  }

  function animate() {
    ctxTrail.save();
    ctxTrail.globalCompositeOperation = "destination-out";
    ctxTrail.fillStyle = "rgba(0,0,0,0.1)";
    ctxTrail.fillRect(0, 0, width, height);
    ctxTrail.restore();

    ctxFaces.clearRect(0, 0, width, height);

    handleGhostCollisions();

    for (const g of ghosts) {
      g.update();
      g.draw(ctxFaces);
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
