const canvas = document.getElementById('agi-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], targets = [];
const TEXT = 'AGI';
const DENSITY = 6;

// 根据文字生成目标坐标
function buildTargets() {
  targets = [];
  const off = document.createElement('canvas');
  off.width = W; off.height = H;
  const offCtx = off.getContext('2d');
  offCtx.fillStyle = '#fff';
  offCtx.font = `${W/4}px sans-serif`;
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.fillText(TEXT, W/2, H/2);

  const img = offCtx.getImageData(0, 0, W, H).data;
  for (let y = 0; y < H; y += DENSITY) {
    for (let x = 0; x < W; x += DENSITY) {
      if (img[(y * W + x) * 4 + 3] > 128) {
        targets.push({ x, y });
      }
    }
  }
}

// 初始化画布大小和粒子
function init() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  buildTargets();
  particles = targets.map(t => ({
    x: Math.random() * W,
    y: Math.random() * H,
    tx: t.x,
    ty: t.y,
    vx: 0,
    vy: 0
  }));
}

// 动画主循环
function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    // 简单弹簧力模型
    const dx = p.tx - p.x;
    const dy = p.ty - p.y;
    p.vx += dx * 0.01;
    p.vy += dy * 0.01;
    p.vx *= 0.92;
    p.vy *= 0.92;
    p.x += p.vx;
    p.y += p.vy;
    ctx.fillStyle = '#0f0';
    ctx.fillRect(p.x, p.y, 2, 2);
  });
  requestAnimationFrame(animate);
}

// 自适应窗口变化
window.addEventListener('resize', () => {
  init();
});

// 启动
init();
animate();
