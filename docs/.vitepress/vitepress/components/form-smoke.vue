<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";
import { useData } from "vitepress/client";

// ---------- VitePress 主题同步 ----------
const { isDark } = useData();
console.log("isDark", isDark.value);

// ---------- 常量 ----------
const LIGHT_URL = new URL("../images/form-page-light.png", import.meta.url)
  .href;
const DARK_URL = new URL("../images/form-page-dark.png", import.meta.url).href;
const DPR = 1;

const MODES = {
  light: {
    canvasBg: "#c9ced6",
    canvasTint: "rgba(201,206,214,0.05)",
    pngBgRgb: "237,240,242",
    borderR: 220,
    borderG: 223,
    borderB: 230,
    textLum: 210, // lum < textLum = 文字(深色文字)
    interiorTextLum: 250, // 日期/时间选择器图标抗锯齿像素保留
    textBelow: true, // 文字在阈值下方
  },
  dark: {
    canvasBg: "#2c2c2f",
    canvasTint: "rgba(44,44,47,0.05)",
    pngBgRgb: "20,20,20",
    borderR: 76,
    borderG: 77,
    borderB: 79,
    textLum: 90, // lum >= textLum = 文字(浅色文字)
    interiorTextLum: 40,
    textBelow: false, // 文字在阈值上方
  },
} as const;

const CONTROLS_SRC = [
  { x0: 121, y0: 20, x1: 553, y1: 51 },
  { x0: 121, y0: 70, x1: 553, y1: 101 },
  { x0: 121, y0: 122, x1: 318, y1: 153 },
  { x0: 355, y0: 122, x1: 553, y1: 153 },
  { x0: 121, y0: 172, x1: 553, y1: 223 },
];

// ---------- 模板引用 ----------
const canvasRef = ref<HTMLCanvasElement>();

// ---------- 响应式状态 ----------
// mode 与 VitePress 主题同步：isDark=true → dark，否则 light
const mode = computed<"light" | "dark">(() =>
  isDark.value ? "dark" : "light",
);
const running = ref(false);
const animEnded = ref(false);
const restoring = ref(false);

// 主题切换按钮的标签：显示当前已加载的模式
const modeLabel = computed(() => (mode.value === "dark" ? "Dark" : "Light"));

function clearCycleTimer() {
  if (cycleTimer) {
    clearTimeout(cycleTimer);
    cycleTimer = null;
  }
}

function scheduleCycleAction(delay: number, action: () => void) {
  clearCycleTimer();
  cycleTimer = window.setTimeout(() => {
    cycleTimer = null;
    action();
  }, delay);
}

// cfg 用 reactive：动画函数中直接 cfg.borderR 访问，无需 .value
const cfg = reactive({ ...MODES[mode.value] });
const imgInfo = reactive({ x: 0, y: 0, w: 0, h: 0, scale: 1 });

// ---------- 非响应式画布资源（rAF 高频访问，避免响应式开销） ----------
let W = 0;
let H = 0;
let ctx!: CanvasRenderingContext2D;
let off!: HTMLCanvasElement;
let octx!: CanvasRenderingContext2D;
let textCanvas!: HTMLCanvasElement;
let tctx!: CanvasRenderingContext2D;
let formBgCanvas!: HTMLCanvasElement;
let fctx!: CanvasRenderingContext2D;
let trailCanvas!: HTMLCanvasElement;
let trctx!: CanvasRenderingContext2D;
let img!: HTMLImageElement;
let imgLoaded = false;
let controls: { x0: number; y0: number; x1: number; y1: number }[] = [];
let particles: any[] = [];
let particleBlueprints: any[] = [];
let restoreParticles: any[] = [];
let restoreT = 0;
let initParticleCount = 0;
let rafId = 0;
let stopped = false;
let autoCycleEnabled = false;
let cycleTimer: number | null = null;

// ---------- 粒子类 ----------
class Particle {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  isBorder: boolean;
  bp: any;
  alive: boolean;
  vx = 0;
  vy = 0;
  life = 1;
  alpha = 1;
  size = 0;
  delay = 0;
  started = false;
  fadeRate = 0;

  constructor(
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    isBorder: boolean,
    bp: any,
  ) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
    this.isBorder = isBorder;
    this.bp = bp || null; // 蓝图引用:死亡时回写消散终点坐标
    this.alive = true;
    if (isBorder) {
      this.vx = 0;
      this.vy = 0;
      this.life = 1;
      this.alpha = 1;
      this.size = (0.7 + Math.random() * 0.7) * DPR;
      this.delay = Math.random() * 30;
      this.started = false;
    } else {
      this.alpha = 1;
      this.fadeRate = 0.022 + Math.random() * 0.014;
    }
  }

  update() {
    if (this.isBorder) {
      if (!this.started) {
        if (this.delay-- > 0) return;
        this.started = true;
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 0.55;
        this.vx = Math.cos(ang) * spd;
        this.vy = Math.sin(ang) * spd - 0.32;
      }
      this.vx += (Math.random() - 0.5) * 0.22;
      this.vy -= 0.025 + Math.random() * 0.015;
      this.vx *= 0.95;
      this.vy *= 0.965;
      this.x += this.vx;
      this.y += this.vy;
      this.life -= 0.012 + Math.random() * 0.003;
      this.alpha = Math.max(this.life, 0);
      if (this.life <= 0) {
        this.alive = false;
        // 回写消散终点(最后可见位置),还原动画以此为起点 → 真实倒放
        if (this.bp) {
          this.bp.deathX = this.x;
          this.bp.deathY = this.y;
        }
      }
    } else {
      this.alpha -= this.fadeRate;
      if (this.alpha <= 0) this.alive = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    let r: number, g: number, b: number, size: number;
    if (this.isBorder) {
      r = cfg.borderR;
      g = cfg.borderG;
      b = cfg.borderB;
      size = this.size;
    } else {
      r = this.r;
      g = this.g;
      b = this.b;
      size = 0.35 * DPR;
    }
    ctx.fillStyle = `rgba(${r},${g},${b},${this.alpha * 0.9})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---------- 函数 ----------
function resize() {
  const canvas = canvasRef.value!;
  W = canvas.width = 574 * DPR;
  H = canvas.height = 262 * DPR;
  canvas.style.width = 574 + "px";
  canvas.style.height = 262 + "px";
  off.width = W;
  off.height = H;
  textCanvas.width = W;
  textCanvas.height = H;
  formBgCanvas.width = W;
  formBgCanvas.height = H;
  trailCanvas.width = W;
  trailCanvas.height = H;
  if (imgInfo.w > 0) loadImgToOff();
}

function loadImgToOff() {
  octx.clearRect(0, 0, W, H);
  const scale = imgInfo.scale;
  const finalW = img.width * scale;
  const finalH = img.height * scale;
  imgInfo.w = finalW;
  imgInfo.h = finalH;
  imgInfo.scale = scale;
  imgInfo.x = (W - finalW) / 2;
  imgInfo.y = (H - finalH) / 2;
  octx.drawImage(img, imgInfo.x, imgInfo.y, finalW, finalH);
  controls = CONTROLS_SRC.map((c) => ({
    x0: imgInfo.x + c.x0 * scale,
    y0: imgInfo.y + c.y0 * scale,
    x1: imgInfo.x + c.x1 * scale,
    y1: imgInfo.y + c.y1 * scale,
  }));
}

function classifyBorder(x: number, y: number, bw: number, bh: number) {
  for (let i = 0; i < controls.length; i++) {
    const c = controls[i];
    if (
      x >= c.x0 - 0.5 &&
      x <= c.x1 + 0.5 &&
      y >= c.y0 - 0.5 &&
      y <= c.y1 + 0.5
    ) {
      const dx = Math.min(x - c.x0, c.x1 - x);
      const dy = Math.min(y - c.y0, c.y1 - y);
      const isBorder = dx <= bw || dy <= bh;
      return { isBorder, insideAny: true, ci: i };
    }
  }
  return { isBorder: false, insideAny: false, ci: -1 };
}

function buildParticles() {
  if (!imgLoaded) return;
  const imgData = octx.getImageData(0, 0, W, H).data;
  particles = [];
  particleBlueprints = [];
  const step = Math.max(2, Math.floor(2 * DPR));
  const bw = 1.5 * imgInfo.scale;
  const bh = 1.5 * imgInfo.scale;
  const CARET_EXCLUDE = 30; // el-select 右侧倒三角排除区宽度(像素)
  const textImg = tctx.createImageData(W, H);
  const td = textImg.data;
  const bgImg = fctx.createImageData(W, H);
  const bd = bgImg.data;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (imgData[i + 3] <= 128) continue;
      const lum =
        imgData[i] * 0.299 + imgData[i + 1] * 0.587 + imgData[i + 2] * 0.114;
      const { isBorder, insideAny, ci } = classifyBorder(x, y, bw, bh);
      // el-select(ci===1)右侧 CARET_EXCLUDE 像素内的倒三角区域:不保留为文字,随动画消散
      const inSelectCaret =
        ci === 1 && x > controls[1].x1 - CARET_EXCLUDE * imgInfo.scale;
      // 模式感知文字判定:light lum<textLum=文字 / dark lum>=textLum=文字
      const isText = cfg.textBelow ? lum < cfg.textLum : lum >= cfg.textLum;

      if (isText && !inSelectCaret) {
        td[i] = imgData[i];
        td[i + 1] = imgData[i + 1];
        td[i + 2] = imgData[i + 2];
        td[i + 3] = 255;
        continue;
      }
      if (!insideAny) {
        bd[i] = imgData[i];
        bd[i + 1] = imgData[i + 1];
        bd[i + 2] = imgData[i + 2];
        bd[i + 3] = 255;
        continue;
      }
      // 日期/时间选择器(controls[2]、controls[3])图标抗锯齿边缘保留为文字
      const isInteriorText = cfg.textBelow
        ? lum < cfg.interiorTextLum
        : lum >= cfg.interiorTextLum;
      if (!isBorder && (ci === 2 || ci === 3) && isInteriorText) {
        td[i] = imgData[i];
        td[i + 1] = imgData[i + 1];
        td[i + 2] = imgData[i + 2];
        td[i + 3] = 255;
        continue;
      }
      // 其余:边框飘散粒子 或 控件内背景淡出粒子(含 el-select 倒三角)
      if (x % step !== 0 || y % step !== 0) continue;
      // 蓝图随粒子同步创建;deathX/deathY 由粒子消散死亡时回写
      const bp = {
        x,
        y,
        r: imgData[i],
        g: imgData[i + 1],
        b: imgData[i + 2],
        isBorder,
        deathX: null as number | null,
        deathY: null as number | null,
      };
      particleBlueprints.push(bp);
      particles.push(
        new Particle(
          x,
          y,
          imgData[i],
          imgData[i + 1],
          imgData[i + 2],
          isBorder,
          bp,
        ),
      );
    }
  }
  tctx.clearRect(0, 0, W, H);
  tctx.putImageData(textImg, 0, 0);
  fctx.clearRect(0, 0, W, H);
  fctx.putImageData(bgImg, 0, 0);
  trctx.clearRect(0, 0, W, H);
}

function drawFinalLayers() {
  // 绘制动画阶段公共的 3+4+5 层(粒子层 → 过色层 → 文字层)
  // 动画播放中 / 动画结束后,都用这个合成,保证终态一致不跳回初始 PNG
  // ③ 粒子积累层 → 主画布(含拖尾)
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(trailCanvas, 0, 0);
  // ④ 控件内部过色:随粒子剩余比例 → 终点实心 #F5F7FA
  const fadeRatio =
    initParticleCount > 0 ? 1 - particles.length / initParticleCount : 1;
  if (fadeRatio > 0.01) {
    ctx.fillStyle = `rgba(${cfg.pngBgRgb},${fadeRatio})`;
    for (const c of controls) {
      ctx.fillRect(c.x0 - 4, c.y0 - 4, c.x1 - c.x0 + 8, c.y1 - c.y0 + 8);
    }
  }
  // ⑤ 文字层(永远最顶)
  ctx.drawImage(textCanvas, 0, 0);
}

function loop() {
  if (stopped) return;
  if (!running.value && !animEnded.value && !restoring.value) {
    // 初始未播放:静止阶段,显示完整原始表单 PNG
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = cfg.canvasBg;
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(off, 0, 0);
    rafId = requestAnimationFrame(loop);
    return;
  }
  if (restoring.value) {
    // 逆向还原:粒子从散落位置飞回原位,聚集成边框和背景
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = cfg.canvasBg;
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(formBgCanvas, 0, 0);
    // 原始 PNG 渐入(含边框、白底、文字)
    ctx.globalAlpha = restoreT;
    ctx.drawImage(off, 0, 0);
    ctx.globalAlpha = 1;
    // 过色层渐出(控件内 #EDEFF2 逐步透明,露出下方 PNG)
    const overlayAlpha = 1 - restoreT;
    if (overlayAlpha > 0.01) {
      ctx.fillStyle = `rgba(${cfg.pngBgRgb},${overlayAlpha})`;
      for (const c of controls) {
        ctx.fillRect(c.x0 - 4, c.y0 - 4, c.x1 - c.x0 + 8, c.y1 - c.y0 + 8);
      }
    }
    // 更新还原粒子(拖尾淡化 → 画粒子)
    trctx.globalCompositeOperation = "destination-out";
    trctx.fillStyle = "rgba(0,0,0,0.15)";
    trctx.fillRect(0, 0, W, H);
    trctx.globalCompositeOperation = "lighter";
    for (let i = restoreParticles.length - 1; i >= 0; i--) {
      const p = restoreParticles[i];
      if (p.delay > 0) {
        p.delay--;
      } else {
        if (p.isBorder) {
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          p.x += dx * 0.08;
          p.y += dy * 0.08;
          p.alpha = Math.min(p.alpha + 0.04, 1);
          if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && p.alpha >= 0.95)
            p.alive = false;
        } else {
          p.alpha = Math.min(p.alpha + 0.035, 1);
          if (p.alpha >= 0.95) p.alive = false;
        }
      }
      if (p.alpha > 0) {
        const pr = p.isBorder ? cfg.borderR : p.r;
        const pg = p.isBorder ? cfg.borderG : p.g;
        const pb = p.isBorder ? cfg.borderB : p.b;
        const sz = p.isBorder ? (0.7 + Math.random() * 0.5) * DPR : 0.35 * DPR;
        trctx.fillStyle = `rgba(${pr},${pg},${pb},${p.alpha * 0.9})`;
        trctx.beginPath();
        trctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
        trctx.fill();
      }
      if (!p.alive) restoreParticles.splice(i, 1);
    }
    trctx.globalCompositeOperation = "source-over";
    ctx.drawImage(trailCanvas, 0, 0);
    ctx.drawImage(textCanvas, 0, 0);
    restoreT += 0.02;
    if (restoreT >= 1) restoreT = 1;
    if (restoreParticles.length === 0 && restoreT >= 1) {
      restoring.value = false;
      animEnded.value = false;
      trctx.clearRect(0, 0, W, H);
    }
    rafId = requestAnimationFrame(loop);
    return;
  }
  // 运行中(running=true) 或 播放完毕(running=false && animEnded=true) 都走此分支
  // → 播放完毕后不会重回"画初始 PNG"的路径,终态画面保持不变
  ctx.globalCompositeOperation = "source-over";
  // ① 打底 + ② 表单背景层(控件外区域)
  ctx.fillStyle = cfg.canvasBg;
  ctx.fillRect(0, 0, W, H);
  ctx.drawImage(formBgCanvas, 0, 0);

  if (running.value) {
    // 只有播放中才更新粒子和拖尾(淡化 + 偏色 + 新帧粒子)
    trctx.globalCompositeOperation = "destination-out";
    trctx.fillStyle = "rgba(0,0,0,0.22)";
    trctx.fillRect(0, 0, W, H);
    trctx.globalCompositeOperation = "source-over";
    trctx.fillStyle = cfg.canvasTint;
    trctx.fillRect(0, 0, W, H);
    trctx.globalCompositeOperation = "lighter";
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      if (p.alive) p.draw(trctx);
      else particles.splice(i, 1);
    }
  }

  drawFinalLayers();

  if (running.value && particles.length === 0) {
    // 本轮播完:打标,保持终态画面不再回滚
    running.value = false;
    animEnded.value = true;
    // 清空拖尾层:粒子死亡瞬间残留的淡化轨迹会被冻结在终态上,必须清除
    trctx.clearRect(0, 0, W, H);
  }
  rafId = requestAnimationFrame(loop);
}

function start() {
  if (!imgLoaded || restoring.value) return;
  buildParticles();
  initParticleCount = particles.length;
  animEnded.value = false;
  running.value = true;
}

function restore() {
  if (!imgLoaded || !animEnded.value || restoring.value) return;
  restoring.value = true;
  restoreT = 0;
  trctx.clearRect(0, 0, W, H);
  // 从快照创建还原粒子:边框粒子从消散终点飞回原位(真实倒放),背景粒子原地淡入
  restoreParticles = particleBlueprints.map((bp) => {
    if (bp.isBorder) {
      // 起点 = 消散时回写的死亡位置;缺失时回退到原位上方小幅随机
      const hasDeath = bp.deathX != null;
      const startX = hasDeath ? bp.deathX : bp.x + (Math.random() - 0.5) * 40;
      const startY = hasDeath ? bp.deathY : bp.y - 10 - Math.random() * 30;
      return {
        x: startX,
        y: startY,
        targetX: bp.x,
        targetY: bp.y,
        r: bp.r,
        g: bp.g,
        b: bp.b,
        isBorder: true,
        alpha: 0,
        delay: Math.random() * 20,
        alive: true,
      };
    }
    return {
      x: bp.x,
      y: bp.y,
      targetX: bp.x,
      targetY: bp.y,
      r: bp.r,
      g: bp.g,
      b: bp.b,
      isBorder: false,
      alpha: 0,
      delay: Math.random() * 15,
      alive: true,
    };
  });
}

// 切换 light/dark 模式:重载对应 PNG,重置动画状态 → 回到初始静止表单
function setModeImage() {
  Object.assign(cfg, MODES[mode.value]);
  running.value = false;
  animEnded.value = false;
  restoring.value = false;
  restoreT = 0;
  particles = [];
  particleBlueprints = [];
  restoreParticles = [];
  initParticleCount = 0;
  tctx.clearRect(0, 0, W, H);
  fctx.clearRect(0, 0, W, H);
  trctx.clearRect(0, 0, W, H);
  img.src = mode.value === "dark" ? DARK_URL : LIGHT_URL;
}

// ---------- 按钮事件 ----------
function onReplay() {
  if (!running.value && !restoring.value) start();
}

function onRestore() {
  if (animEnded.value && !restoring.value) restore();
}

// 主题切换：调用 VitePress 内建的 toggleDark，由 isDark watcher 触发 setModeImage
function onToggleMode() {
  isDark.value = !isDark.value;
}

// 监听 VitePress 主题变化 → 重新加载对应 PNG，重置动画状态
watch(isDark, () => {
  if (imgLoaded) setModeImage();
});

watch(animEnded, (ended) => {
  if (!autoCycleEnabled || !ended || restoring.value) return;
  scheduleCycleAction(3000, () => restore());
});

watch(restoring, (isRestoring) => {
  if (!autoCycleEnabled || isRestoring) return;
  if (!running.value && !animEnded.value) {
    scheduleCycleAction(3000, () => start());
  }
});

// ---------- 生命周期 ----------
onMounted(() => {
  const canvas = canvasRef.value!;
  ctx = canvas.getContext("2d")!;

  // 离屏 canvas:加载并绘制表单 PNG
  off = document.createElement("canvas");
  octx = off.getContext("2d", { willReadFrequently: true })!;

  // 文字层 canvas:所有暗色文字(控件内+标签)→ 静态常驻
  textCanvas = document.createElement("canvas");
  tctx = textCanvas.getContext("2d")!;

  // 表单背景层:只绘制"控件外区域"的浅色像素(标签背景、表单底色)
  formBgCanvas = document.createElement("canvas");
  fctx = formBgCanvas.getContext("2d")!;

  // 粒子积累层:保存粒子和拖尾(透明背景独立画布)
  trailCanvas = document.createElement("canvas");
  trctx = trailCanvas.getContext("2d")!;

  // 加载 PNG：首屏应按当前主题同步选择 dark / light 版
  img = new Image();
  img.onload = () => {
    imgLoaded = true;
    loadImgToOff();
    autoCycleEnabled = true;
    start();
  };
  img.src = mode.value === "dark" ? DARK_URL : LIGHT_URL;

  resize();
  addEventListener("resize", resize);
  loop();
});

onUnmounted(() => {
  stopped = true;
  autoCycleEnabled = false;
  clearCycleTimer();
  if (rafId) cancelAnimationFrame(rafId);
  removeEventListener("resize", resize);
});
</script>

<template>
  <div class="form-smoke">
    <canvas ref="canvasRef" id="stage"></canvas>
  </div>
</template>

<style scoped>
.form-smoke {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

#stage {
  display: block;
  margin: 0 auto;
}
</style>
