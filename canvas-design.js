const palette = {
  ink: "#f5f5f5",
  dark: "#0a0a0a",
  panel: "#111111",
  blue: "#3b82f6",
  cyan: "#22d3ee",
  violet: "#8b5cf6",
  orange: "#f97316",
  green: "#22c55e",
  gray: "#6b7280",
  amber: "#f59e0b",
};

function scaleCanvas(canvas, logicalWidth, logicalHeight) {
  const ratio = window.devicePixelRatio || 1;
  const w = Math.round(logicalWidth * ratio);
  const h = Math.round(logicalHeight * ratio);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return ctx;
}

function drawJevonsIcon(ctx, x, y, size, variant) {
  const unit = size / 72;
  ctx.save();
  ctx.translate(x, y);

  const r = 16 * unit;

  // Glow behind
  ctx.shadowColor = palette.blue;
  ctx.shadowBlur = 16 * unit;

  // Outer rounded square
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(72 * unit - r, 0);
  ctx.quadraticCurveTo(72 * unit, 0, 72 * unit, r);
  ctx.lineTo(72 * unit, 72 * unit - r);
  ctx.quadraticCurveTo(72 * unit, 72 * unit, 72 * unit - r, 72 * unit);
  ctx.lineTo(r, 72 * unit);
  ctx.quadraticCurveTo(0, 72 * unit, 0, 72 * unit - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fillStyle = palette.dark;
  ctx.fill();

  ctx.shadowBlur = 0;

  // Gradient border
  const gradient = ctx.createLinearGradient(0, 0, 72 * unit, 72 * unit);
  gradient.addColorStop(0, palette.blue);
  gradient.addColorStop(0.5, palette.cyan);
  gradient.addColorStop(1, palette.violet);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2 * unit;
  ctx.stroke();

  if (variant === "brand") {
    // "J" letterform
    ctx.beginPath();
    ctx.moveTo(28 * unit, 18 * unit);
    ctx.lineTo(50 * unit, 18 * unit);
    ctx.moveTo(44 * unit, 18 * unit);
    ctx.lineTo(44 * unit, 48 * unit);
    ctx.quadraticCurveTo(44 * unit, 56 * unit, 36 * unit, 56 * unit);
    ctx.quadraticCurveTo(28 * unit, 56 * unit, 26 * unit, 50 * unit);
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 4 * unit;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // Small data curve (represents Jevons' statistical work)
    ctx.beginPath();
    ctx.moveTo(24 * unit, 36 * unit);
    ctx.quadraticCurveTo(30 * unit, 30 * unit, 36 * unit, 36 * unit);
    ctx.quadraticCurveTo(42 * unit, 42 * unit, 48 * unit, 36 * unit);
    ctx.strokeStyle = palette.cyan;
    ctx.lineWidth = 2 * unit;
    ctx.lineCap = "round";
    ctx.stroke();

    // Small dot at peak
    ctx.beginPath();
    ctx.arc(36 * unit, 34 * unit, 2 * unit, 0, Math.PI * 2);
    ctx.fillStyle = palette.cyan;
    ctx.fill();

  } else {
    // Hero variant: larger "J" with sunspot cycle motif
    // "J" letterform - larger
    ctx.beginPath();
    ctx.moveTo(26 * unit, 16 * unit);
    ctx.lineTo(52 * unit, 16 * unit);
    ctx.moveTo(46 * unit, 16 * unit);
    ctx.lineTo(46 * unit, 48 * unit);
    ctx.quadraticCurveTo(46 * unit, 58 * unit, 36 * unit, 58 * unit);
    ctx.quadraticCurveTo(26 * unit, 58 * unit, 24 * unit, 50 * unit);
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 5 * unit;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // Sunspot cycle wave
    ctx.beginPath();
    for (let t = 0; t <= Math.PI * 4; t += 0.05) {
      const sx = 12 * unit + t / (Math.PI * 4) * 48 * unit;
      const sy = 42 * unit + Math.sin(t) * 8 * unit;
      if (t === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = palette.amber;
    ctx.lineWidth = 1.5 * unit;
    ctx.lineCap = "round";
    ctx.stroke();

    // Data dots on the wave
    for (let t = 0; t <= Math.PI * 4; t += Math.PI / 2) {
      const sx = 12 * unit + t / (Math.PI * 4) * 48 * unit;
      const sy = 42 * unit + Math.sin(t) * 8 * unit;
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5 * unit, 0, Math.PI * 2);
      ctx.fillStyle = palette.cyan;
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawBrandLogo() {
  const canvas = document.getElementById("brand-canvas");
  if (!canvas) return;
  const ctx = scaleCanvas(canvas, 22, 22);
  ctx.clearRect(0, 0, 22, 22);
  drawJevonsIcon(ctx, 0, 0, 22, "brand");
}

function drawBrandLogoFooter() {
  const canvas = document.getElementById("brand-canvas-footer");
  if (!canvas) return;
  const ctx = scaleCanvas(canvas, 20, 20);
  ctx.clearRect(0, 0, 20, 20);
  drawJevonsIcon(ctx, 0, 0, 20, "brand");
}

function drawHeroLogo() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = scaleCanvas(canvas, 96, 96);
  ctx.clearRect(0, 0, 96, 96);
  drawJevonsIcon(ctx, 0, 0, 96, "hero");
}

function installCanvasFavicon() {
  const canvas = document.createElement("canvas");
  canvas.width = 72;
  canvas.height = 72;
  const ctx = canvas.getContext("2d");
  drawJevonsIcon(ctx, 0, 0, 72, "brand");

  const link = document.querySelector("link[rel='icon']") || document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = canvas.toDataURL("image/png");
  document.head.appendChild(link);
}

function drawAll() {
  drawBrandLogo();
  drawBrandLogoFooter();
  drawHeroLogo();
}

function initCanvas() {
  drawAll();
  installCanvasFavicon();
}

function safeInit() {
  const brandCanvas = document.getElementById("brand-canvas");
  if (brandCanvas && brandCanvas.getContext) {
    initCanvas();
  } else {
    requestAnimationFrame(safeInit);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", safeInit);
} else {
  safeInit();
}
