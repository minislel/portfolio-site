<template>
  <section class="hero-container">
    <!-- Animated globe rendered behind the card -->
    <canvas ref="canvasRef" class="hero-globe-canvas" aria-hidden="true"></canvas>

    <!-- Centered Hero Card -->
    <PortfolioCard class="hero-card" accent="cyan">
      <div class="hero-content">
        <span class="hero-badge">{{ t('.NET Backend Engineer & Builder', '.NET Backend Engineer & Builder') }}</span>
        <h1 class="hero-title">
          {{ t('Cześć! jestem', 'Hi! I am') }} <span class="gradient-text">Marcin Świderski</span>
        </h1>
        <p class="hero-subtitle">
          {{ t('Kiedyś dowoziłem jedzenie, teraz dowożę', 'I used to deliver food, now I deliver') }}&nbsp;<span class="typewriter-wrap"><span class="typewriter-text">{{ typedText }}</span><span class="typewriter-cursor" :class="{ blink: isCursorBlinking }">▌</span></span>
        </p>
        <div class="hero-actions">
          <a href="#projekty" class="btn-primary">{{ t('Zobacz projekty ➔', 'View projects ➔') }}</a>
          <a href="#o-mnie" class="btn-secondary">{{ t('O mnie', 'About me') }}</a>
        </div>
      </div>
    </PortfolioCard>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import PortfolioCard from './PortfolioCard.vue';
import { useLocale } from '../utils/useLocale.js';

const { t, locale } = useLocale();
const canvasRef = ref(null);

// ── Typewriter ────────────────────────────────────────────────────────────
const phrasesPL = [
  ' stabilne rozwiązania .NET',
  ' szybkie REST API',
  ' Dockerowe kontenery',
  'czysty, działający kod',
  'działające mikroserwisy',
  'wyniki, a nie wymówki.',
];
const phrasesEN = [
  'solid .NET solutions',
  'fast REST APIs',
  'Docker containers',
  'clean, working code',
  'working microservices',
  'results, not excuses.',
];

const typedText = ref('');
const isCursorBlinking = ref(false);

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let twTimer = null;

const TYPE_SPEED   = 55;
const DELETE_SPEED = 30;
const PAUSE_AFTER  = 1800;
const PAUSE_BEFORE = 300;

function getPhrases() {
  return locale?.value === 'en' ? phrasesEN : phrasesPL;
}

function resetTypewriter() {
  clearTimeout(twTimer);
  phraseIndex = 0;
  charIndex = 0;
  isDeleting = false;
  isCursorBlinking.value = false;
  typedText.value = '';
  twTimer = setTimeout(tick, PAUSE_BEFORE);
}

watch(locale, () => {
  resetTypewriter();
});

function tick() {
  const phrases = getPhrases();
  const current = phrases[phraseIndex];

  if (!isDeleting) {
    // Typing
    isCursorBlinking.value = false;
    charIndex++;
    typedText.value = current.slice(0, charIndex);

    if (charIndex === current.length) {
      // Done typing — pause then start deleting
      isCursorBlinking.value = true;
      twTimer = setTimeout(() => {
        isDeleting = true;
        isCursorBlinking.value = false;
        twTimer = setTimeout(tick, PAUSE_BEFORE);
      }, PAUSE_AFTER);
      return;
    }
  } else {
    // Deleting
    charIndex--;
    typedText.value = current.slice(0, charIndex);

    if (charIndex === 0) {
      // Done deleting — move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      twTimer = setTimeout(tick, PAUSE_BEFORE);
      return;
    }
  }

  twTimer = setTimeout(tick, isDeleting ? DELETE_SPEED : TYPE_SPEED);
}



onMounted(() => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  let W, H, cx, cy, radius;
  let animId = null;

  const PALETTE = [
    [0,   242, 254],  // cyan
    [191, 90,  242],  // purple
    [57,  255, 20 ],  // green
    [10,  132, 255],  // blue
  ];

  // ── Dots on a Fibonacci sphere ────────────────────────────────────────
  const DOT_COUNT = 420;
  const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
    const phi   = Math.acos(1 - (2 * (i + 0.5)) / DOT_COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    return {
      ox: Math.sin(phi) * Math.cos(theta),
      oy: Math.cos(phi),
      oz: Math.sin(phi) * Math.sin(theta),
      pulse: Math.random() * Math.PI * 2,
      ci:    Math.floor(Math.random() * 4),
    };
  });

  // ── Arc connections between random dot pairs ─────────────────────────
  const ARC_COUNT = 60;
  const arcs = Array.from({ length: ARC_COUNT }, () => ({
    i:        Math.floor(Math.random() * DOT_COUNT),
    j:        Math.floor(Math.random() * DOT_COUNT),
    progress: Math.random(),
    speed:    0.00012 + Math.random() * 0.00015,
    ci:       Math.floor(Math.random() * 4),
  }));

  // ── Resize ─────────────────────────────────────────────────────────────
  // JS owns all sizing/positioning — no CSS calc tricks.
  const BLEED = 280; // px outside the container on each side
  function resize() {
    const dpr  = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const cW   = rect.width;
    const cH   = rect.height;

    W = cW + BLEED * 2;
    H = cH + BLEED * 2;

    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    canvas.style.left   = -BLEED + 'px';
    canvas.style.top    = -BLEED + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Center of canvas == center of container
    cx = W / 2;
    cy = H / 2;

    // Radius: visible around card but not overwhelming
    radius = Math.min(
      Math.max(cW * 0.43, cH * 0.54),
      480
    );
  }

  // ── Mouse parallax ─────────────────────────────────────────────────────
  let mx = 0, my = 0;
  function onMouse(e) {
    mx = (e.clientX / window.innerWidth  - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
  }
  window.addEventListener('mousemove', onMouse, { passive: true });

  // ── Rotation state ──────────────────────────────────────────────────────
  let rotY = 0, rotX = 0, tRotX = 0;

  // ── 3-D helpers ─────────────────────────────────────────────────────────
  function ry(x, y, z, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return { x: c*x + s*z, y, z: -s*x + c*z };
  }
  function rx(x, y, z, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return { x, y: c*y - s*z, z: s*y + c*z };
  }
  function project({ x, y, z }) {
    const fov = radius * 2.8;
    const s   = fov / (fov + z * radius * 0.5);
    return { sx: cx + x * radius * s, sy: cy + y * radius * s, scale: s, z };
  }

  // ── Draw loop ─────────────────────────────────────────────────────────
  let last = 0;
  let isGlobeVisible = true;
  function draw(ts) {
    if (!isGlobeVisible) return;
    animId = requestAnimationFrame(draw);
    const dt = Math.min(ts - last, 32);
    last = ts;

    ctx.clearRect(0, 0, W, H);

    // Rotation update
    rotY  += 0.00009 * dt;
    tRotX  = my * 0.5;
    rotX  += (tRotX - rotX) * 0.035;

    // Project all dots
    const proj = dots.map(d => {
      let p = ry(d.ox, d.oy, d.oz, rotY);
      p     = rx(p.x, p.y, p.z, rotX + mx * 0.2);
      return { ...project(p), pulse: d.pulse, ci: d.ci };
    });

    // ── Globe atmosphere glow ────────────────────────────────────────────
    const grd = ctx.createRadialGradient(cx, cy, radius * 0.55, cx, cy, radius * 1.2);
    grd.addColorStop(0,    'rgba(0,242,254,0)');
    grd.addColorStop(0.72, 'rgba(0,242,254,0.028)');
    grd.addColorStop(1,    'rgba(191,90,242,0.07)');
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // ── Arcs ─────────────────────────────────────────────────────────────
    for (const arc of arcs) {
      arc.progress += arc.speed * dt;
      if (arc.progress >= 1) arc.progress -= 1;

      const a = proj[arc.i], b = proj[arc.j];
      if (a.z < -0.35 && b.z < -0.35) continue;

      const [r, g, bl] = PALETTE[arc.ci];
      const vis = ((Math.min(a.z, b.z) + 1) / 2);

      // Faint connection line
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      // Slight arc bulge via quadratic bezier
      const mx2 = (a.sx + b.sx) / 2 - (b.sy - a.sy) * 0.18;
      const my2 = (a.sy + b.sy) / 2 + (b.sx - a.sx) * 0.18;
      ctx.quadraticCurveTo(mx2, my2, b.sx, b.sy);
      ctx.strokeStyle = `rgba(${r},${g},${bl},${vis * 0.22})`;
      ctx.lineWidth   = 0.6;
      ctx.stroke();

      // Travelling photon along the bezier
      const t2  = arc.progress;
      const tx  = (1-t2)*(1-t2)*a.sx + 2*(1-t2)*t2*mx2 + t2*t2*b.sx;
      const ty2 = (1-t2)*(1-t2)*a.sy + 2*(1-t2)*t2*my2 + t2*t2*b.sy;

      const gh = ctx.createRadialGradient(tx, ty2, 0, tx, ty2, 6);
      gh.addColorStop(0, `rgba(${r},${g},${bl},0.95)`);
      gh.addColorStop(1, `rgba(${r},${g},${bl},0)`);
      ctx.beginPath();
      ctx.arc(tx, ty2, 6, 0, Math.PI * 2);
      ctx.fillStyle = gh;
      ctx.fill();
    }

    // ── Dots ──────────────────────────────────────────────────────────────
    for (const p of proj) {
      const vis = (p.z + 1) / 2;
      if (vis < 0.06) continue;
      const [r, g, bl] = PALETTE[p.ci];
      const pulseFactor = 0.75 + 0.25 * Math.sin(ts * 0.0009 + p.pulse);
      const sz    = p.scale * 2.1 * pulseFactor;
      const alpha = vis * 0.88;

      ctx.beginPath();
      ctx.arc(p.sx, p.sy, sz, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${bl},${alpha})`;
      ctx.fill();

      if (vis > 0.7) {
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, sz * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${bl},${alpha * 0.1})`;
        ctx.fill();
      }
    }

    // ── Dashed latitude ring ──────────────────────────────────────────────
    const tiltedB = Math.abs(Math.sin(rotX));
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius, radius * (tiltedB < 0.02 ? 0.02 : tiltedB), 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,242,254,0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 9]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ── Boot ─────────────────────────────────────────────────────────────
  resize();
  animId = requestAnimationFrame(draw);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);

  const io = new IntersectionObserver(([entry]) => {
    const wasVis = isGlobeVisible;
    isGlobeVisible = entry.isIntersecting;
    if (isGlobeVisible && !wasVis) {
      animId = requestAnimationFrame(draw);
    } else if (!isGlobeVisible && animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }, { threshold: 0.05 });
  io.observe(canvas.parentElement);

  // Start typewriter
  twTimer = setTimeout(tick, 600);

  onUnmounted(() => {
    cancelAnimationFrame(animId);
    window.removeEventListener('mousemove', onMouse);
    ro.disconnect();
    io.disconnect();
    clearTimeout(twTimer);
  });
});
</script>

<style scoped>
.hero-container {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem 2rem 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  overflow: visible;
}

/* JS sets left/top/width/height directly — only need position:absolute here */
.hero-globe-canvas {
  position: absolute;
  pointer-events: none;
  z-index: 0;
}

.hero-card {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 4.5rem 3rem !important;
  text-align: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.hero-badge {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-cyan);
  background: rgba(0, 242, 254, 0.12);
  border: 1px solid rgba(0, 242, 254, 0.3);
  padding: 0.4rem 1.25rem;
  border-radius: 100px;
  letter-spacing: 0.05em;
  max-width: 100%;
  word-break: break-word;
}

.hero-title {
  font-size: clamp(1.8rem, 6.5vw, 3.8rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: #ffffff;
  max-width: 900px;
  word-break: break-word;
  text-align: center;
}

.gradient-text {
  background: linear-gradient(135deg, #00f2fe 0%, #bf5af2 50%, #39ff14 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.hero-subtitle {
  font-size: clamp(0.95rem, 3vw, 1.25rem);
  color: var(--text-muted);
  max-width: 680px;
  line-height: 1.6;
  text-align: center;
  min-height: 3.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.typewriter-wrap {
  display: inline;
  white-space: nowrap;
}

.typewriter-text {
  color: var(--accent-cyan);
  font-family: var(--font-mono);
}

.typewriter-cursor {
  color: var(--accent-cyan);
  font-family: var(--font-mono);
  font-weight: 300;
  margin-left: 1px;
  text-shadow: 0 0 8px var(--accent-cyan);
  opacity: 1;
  transition: opacity 0.1s;
}

.typewriter-cursor.blink {
  animation: cursorBlink 0.9s step-start infinite;
}

@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-primary {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 700;
  color: #07090e;
  background: #ffffff;
  padding: 0.85rem 2rem;
  border-radius: 100px;
  text-decoration: none;
  transition: var(--transition-liquid);
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 0 35px rgba(255, 255, 255, 0.5);
  background: #ffffff;
}

.btn-secondary {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.85rem 2rem;
  border-radius: 100px;
  text-decoration: none;
  transition: var(--transition-liquid);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .hero-container {
    padding: 4.5rem 1rem 1.5rem 1rem;
    min-height: 70vh;
  }

  .hero-card {
    padding: 2.5rem 1.25rem !important;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
    gap: 0.85rem;
  }

  .btn-primary, .btn-secondary {
    width: 100%;
    text-align: center;
  }
}
</style>
