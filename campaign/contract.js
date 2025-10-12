//floating faces
(() => {
  const container = document.querySelector(".contract-container");
  const canvasTrail = document.getElementById("ghostTrail");
  const canvasFaces = document.getElementById("ghostFaces");
  const ctxTrail = canvasTrail.getContext("2d");
  const ctxFaces = canvasFaces.getContext("2d");
  const DPR = window.devicePixelRatio || 1;

  let width, height;
  let ghosts = [];

  // Face images
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

  const MIN_SIZE = 40;
  const MAX_SIZE = 80;
  const BASE_SPEED = 0.3;
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
      this.speed = speed;

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

  // Determine ghost count based on width
  function getGhostCount(width) {
    const baseCount = 20; // minimum
    const maxCount = 100; // maximum
    const maxWidth = 1200; // width where maxCount reached
    return Math.round(baseCount + (maxCount - baseCount) * Math.min(width, maxWidth) / maxWidth);
  }

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

    // Recreate ghosts based on current width
    const ghostCount = getGhostCount(width);
    ghosts = Array.from({ length: ghostCount }, () => new Ghost());
  }

  window.addEventListener("resize", resize);
  resize();

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

          g1.x -= nx * overlap * 0.5;
          g1.y -= ny * overlap * 0.5 * VERTICAL_SCALE;
          g2.x += nx * overlap * 0.5;
          g2.y += ny * overlap * 0.5 * VERTICAL_SCALE;

          const tempVx = g1.vx;
          const tempVy = g1.vy;
          g1.vx = g2.vx;
          g1.vy = g2.vy;
          g2.vx = tempVx;
          g2.vy = tempVy;

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

// hanging men
(() => {
  const canvas = document.getElementById("hangingMen");
  const ctx = canvas.getContext("2d");
  const container = document.querySelector(".contract-container");
  const DPR = window.devicePixelRatio || 1;

  let width, height;
  const SCALE = 0.25;
  const BASE_ROPE = 250;
  const BASE_BODY = 200;
  let hangers = [];

  // === Poses for animation ===
  const poses = [
    [[-4,-10,-20],[4,10,10],[-3,-10,-10],[3,10,10]].map(a=>a.map(n=>n*SCALE)),
    [[-2,10,-10],[2,10,5],[-2,-10,5],[2,-5,15]].map(a=>a.map(n=>n*SCALE)),
    [[-2,-10,-5],[2,-10,10],[-2,5,-15],[2,10,-5]].map(a=>a.map(n=>n*SCALE))
  ];
  const headOffsets = [[0,5],[-15,5],[15,5]].map(a=>a.map(n=>n*SCALE));
  const sequence = [0,1,0,2];

  function lerp(a,b,t){ return a + (b-a)*t; }

  // === Calculate number of hangers based on width ===
  function calculateNumHangers() {
    const minSpacing = 80; // minimum horizontal space per hanger
    return Math.max(1, Math.floor(width / minSpacing));
  }

  // === Create hangers dynamically ===
  function createHangers() {
    hangers = [];
    const numHangers = calculateNumHangers();
    const spacing = width / (numHangers + 1);

    for (let i = 0; i < numHangers; i++) {
      hangers.push({
        scale: SCALE,
        posX: spacing * (i + 1),
        anchorY: 43 + Math.random(),
        ropeLength: BASE_ROPE * SCALE * (0.9 + Math.random() * 0.3),
        bodySize: BASE_BODY * SCALE,
        seqIndex: Math.floor(Math.random() * sequence.length),
        t: Math.random(),
        paused: false,
        swingTime: Math.random() * Math.PI * 2,
        swingSpeed: (Math.random() > 0.5 ? 1 : -1) * (0.015 + Math.random() * 0.008)
      });
    }
  }

  // === Handle canvas resizing ===
  function resize() {
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    createHangers(); // regenerate hangers on resize
  }
  resize();
  window.addEventListener("resize", resize);

  // === Draw a single hanger ===
  function drawHanger(h) {
    const swingOffset = Math.sin(h.swingTime) * h.ropeLength * Math.sin(0.015);
    const bodyX = h.posX + swingOffset;
    const ropeOffset = h.ropeLength * 0.4;
    const bodyY = h.anchorY + h.ropeLength - ropeOffset;

    ctx.lineCap = "round";

    // interpolate limbs
    const currentPose = poses[sequence[h.seqIndex]];
    const nextPose = poses[sequence[(h.seqIndex + 1) % sequence.length]];
    const limbs = [];
    for (let i = 0; i < 4; i++) {
      const [s1,c1,e1] = currentPose[i];
      const [s2,c2,e2] = nextPose[i];
      limbs.push([lerp(s1,s2,h.t), lerp(c1,c2,h.t), lerp(e1,e2,h.t)]);
    }

    const [hx1,hy1] = headOffsets[sequence[h.seqIndex]];
    const [hx2,hy2] = headOffsets[sequence[(h.seqIndex + 1) % sequence.length]];
    const headX = lerp(hx1,hx2,h.t);
    const headY = lerp(hy1,hy2,h.t);

    // rope
    ctx.strokeStyle = "#5C4033";
    ctx.lineWidth = 6 * h.scale;
    ctx.beginPath();
    ctx.moveTo(h.posX, h.anchorY);
    ctx.lineTo(bodyX, bodyY - h.bodySize * 0.25 + headY);
    ctx.stroke();

    // body
    ctx.lineWidth = 10 * h.scale;
    ctx.strokeStyle = "#111";
    ctx.beginPath();
    ctx.moveTo(bodyX, bodyY - h.bodySize * 0.1);
    ctx.lineTo(bodyX, bodyY + h.bodySize * 0.25);
    ctx.stroke();

    // arms
    ctx.lineWidth = 6 * h.scale;
    ctx.beginPath();
    ctx.moveTo(bodyX + limbs[0][0], bodyY - 15 * h.scale);
    ctx.quadraticCurveTo(bodyX + limbs[0][1], bodyY + h.bodySize * 0.15, bodyX + limbs[0][2], bodyY + h.bodySize * 0.3);
    ctx.moveTo(bodyX + limbs[1][0], bodyY - 15 * h.scale);
    ctx.quadraticCurveTo(bodyX + limbs[1][1], bodyY + h.bodySize * 0.15, bodyX + limbs[1][2], bodyY + h.bodySize * 0.3);
    ctx.stroke();

    // legs
    ctx.beginPath();
    ctx.moveTo(bodyX + limbs[2][0], bodyY + h.bodySize * 0.25);
    ctx.quadraticCurveTo(bodyX + limbs[2][1], bodyY + h.bodySize * 0.45, bodyX + limbs[2][2], bodyY + h.bodySize * 0.65);
    ctx.moveTo(bodyX + limbs[3][0], bodyY + h.bodySize * 0.25);
    ctx.quadraticCurveTo(bodyX + limbs[3][1], bodyY + h.bodySize * 0.45, bodyX + limbs[3][2], bodyY + h.bodySize * 0.65);
    ctx.stroke();

    // head
    ctx.lineWidth = 4 * h.scale;
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(bodyX + headX, bodyY - h.bodySize * 0.25 + headY, h.bodySize * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // animation updates
    if (!h.paused) {
      h.t += 0.01;
      if (h.t >= 1) {
        h.t = 0;
        h.seqIndex = (h.seqIndex + 1) % sequence.length;
        if (sequence[h.seqIndex] === 1 || sequence[h.seqIndex] === 2) {
          h.paused = true;
          setTimeout(() => (h.paused = false), 250);
        }
      }
    }
    h.swingTime += h.swingSpeed;
  }

  // === Animate all hangers ===
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const h of hangers) drawHanger(h);
    requestAnimationFrame(animate);
  }

  animate();
})();

// signature
(() => {
  const canvas = document.getElementById("signatureCanvas");
  const ctx = canvas.getContext("2d");

  let drawing = false;

  // Base stroke style
  ctx.strokeStyle = "#b20000";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.shadowBlur = 0;
  ctx.shadowColor = "#ff4500"; // infernal glow color

  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function startDrawing(pos) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function drawLine(pos) {
    if (!drawing) return;
    ctx.lineTo(pos.x, pos.y);

    // Glow effect based on random intensity
    ctx.shadowBlur =  + Math.random() * 3;
    ctx.stroke();
  }

  function stopDrawing() {
    drawing = false;
    ctx.shadowBlur = 0; // reset shadow blur
  }

  // Mouse events
  canvas.addEventListener("mousedown", e => startDrawing(getMousePos(e)));
  canvas.addEventListener("mousemove", e => drawLine(getMousePos(e)));
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseout", stopDrawing);

  // Touch events
  canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    const touch = e.touches[0];
    startDrawing(getMousePos(touch));
  });
  canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    const touch = e.touches[0];
    drawLine(getMousePos(touch));
  });
  canvas.addEventListener("touchend", stopDrawing);

  // Save button
  document.getElementById("saveSignature").addEventListener("click", () => {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "signature.png";
    link.href = dataURL;
    link.click();
  });
})();

