<template>
  <div 
    class="orbit-wrapper" 
    ref="wrapperRef"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Background Canvas for Orbits Drawing -->
    <canvas ref="canvasRef" class="orbit-bg-canvas"></canvas>

    <!-- Central Sun Node -->
    <div class="sun-node mono" :style="sunStyle">
      <div class="sun-inner">
        <span class="sun-label">MŚ</span>
        <span class="sun-pulse"></span>
      </div>
    </div>

    <!-- Interactive Planets -->
    <div 
      v-for="(p, idx) in planetsData" 
      :key="p.name"
      :ref="el => setPlanetRef(el, idx)"
      :class="['planet-node', 'accent-' + p.accent, { 'is-active': activePlanet === p.name }]"
      @mouseenter="activePlanet = p.name"
      @mouseleave="activePlanet = null"
      @click="triggerPulse(p)"
    >
      <!-- Planet Body -->
      <div class="planet-body">
        <i :class="p.iconClass"></i>
      </div>

      <!-- Holographic Tooltip Card -->
      <div class="planet-tooltip mono" v-if="activePlanet === p.name">
        <div class="tooltip-header">
          <span class="tooltip-title">{{ p.name }}</span>
          <span :class="['tooltip-tag', p.accent]">{{ p.level }}</span>
        </div>
        <p class="tooltip-desc">{{ p.desc }}</p>
      </div>
    </div>

    <!-- HUD Systems Info -->
    <div class="orbit-hud">
      <span class="hud-item mono">ORBITAL MATRIX: SYNCHRONIZED</span>
      <span class="hud-item mono text-dim">CLICK PLANETS TO SEND KINETIC WAVE</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const wrapperRef = ref(null);
const canvasRef = ref(null);

const activePlanet = ref(null);

// Interactive Mouse Coordinates for 3D Camera Tilt
const mouseX = ref(0);
const mouseY = ref(0);
const lerpMouseX = ref(0);
const lerpMouseY = ref(0);
const isHovered = ref(false);

// 3D Projection Configs
const FOV = 360;
const CAMERA_DISTANCE = 400;

// Central coordinates
const centerX = ref(200);
const centerY = ref(190);

// Base pitch (tilt of the plane) & yaw (rotation of the plane)
const basePitch = 1.05; // radians (approx 60 degrees tilt)
const baseYaw = 0;      // radians

// Planets config
const planetsData = ref([
  {
    name: 'C# / .NET',
    iconClass: 'devicon-csharp-plain',
    level: 'DAILY DRIVER',
    desc: 'Budowa komercyjnych REST API, mikrousług i automatyzacji w Hangfire.',
    accent: 'purple',
    radius: 95,
    angle: 0,
    speed: 0.015
  },
  {
    name: 'Vue.js',
    iconClass: 'devicon-vuejs-plain',
    level: 'BATTLE-TESTED',
    desc: 'Budowanie responsywnych interfejsów i dynamicznych systemów SPA.',
    accent: 'green',
    radius: 95,
    angle: Math.PI, // Opposite side of Orbit 1
    speed: 0.015
  },
  {
    name: 'Docker',
    iconClass: 'devicon-docker-plain',
    level: 'DAILY DRIVER',
    desc: 'Konteneryzacja mikrousług, zarządzanie kontenerami w domowym Homelabie.',
    accent: 'blue',
    radius: 160,
    angle: Math.PI * 0.3,
    speed: 0.009
  },
  {
    name: 'TypeScript',
    iconClass: 'devicon-typescript-plain',
    level: 'BATTLE-TESTED',
    desc: 'Pisanie bezpiecznego kodu frontendowego oraz rozszerzeń Chrome.',
    accent: 'cyan',
    radius: 160,
    angle: Math.PI * 1.3,
    speed: 0.009
  },
  {
    name: 'TrueNAS Scale',
    iconClass: 'fa-solid fa-server', // FontAwesome fallback
    level: 'HOMELAB CORE',
    desc: 'Wielodyskowa retencja danych i hosting prywatnych usług sieciowych.',
    accent: 'orange',
    radius: 220,
    angle: Math.PI * 0.7,
    speed: 0.006
  },
  {
    name: 'Linux / Ubuntu',
    iconClass: 'devicon-linux-plain',
    level: 'DAILY DRIVER',
    desc: 'Administracja systemami operacyjnymi, konfiguracja sieci i bezpieczeństwa.',
    accent: 'cyan',
    radius: 220,
    angle: Math.PI * 1.7,
    speed: 0.006
  }
]);

// Animation states
const planetElRefs = ref([]);
function setPlanetRef(el, idx) {
  if (el) planetElRefs.value[idx] = el;
}
let isVisible = true;
let observer = null;
let animationFrameId = null;

// Track pulses triggered by clicking planets
let linePulses = [];

// Prepare responsive layouts
const sunStyle = computed(() => {
  return {
    left: `${centerX.value}px`,
    top: `${centerY.value}px`
  };
});

function handleMouseMove(e) {
  if (!wrapperRef.value) return;
  const rect = wrapperRef.value.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  // Normalized coordinates (-1 to 1)
  mouseX.value = (e.clientX - rect.left - cx) / cx;
  mouseY.value = (e.clientY - rect.top - cy) / cy;
}

function handleMouseEnter() {
  isHovered.value = true;
}

function handleMouseLeave() {
  isHovered.value = false;
  mouseX.value = 0;
  mouseY.value = 0;
}

// Click to trigger a kinetic shockwave along the orbit path
function triggerPulse(p) {
  linePulses.push({
    radius: p.radius,
    angle: p.angle,
    accent: p.accent,
    speed: 0.08,
    progress: 0
  });
}

function updateAndRender() {
  if (!canvasRef.value || !wrapperRef.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Smooth mouse interpolation for camera tilt
  lerpMouseX.value += (mouseX.value - lerpMouseX.value) * 0.08;
  lerpMouseY.value += (mouseY.value - lerpMouseY.value) * 0.08;
  
  // Dynamically compute camera pitch/yaw based on cursor position
  const pitch = basePitch + lerpMouseY.value * 0.28; // Up/down tilt
  const yaw = baseYaw + lerpMouseX.value * 0.28;     // Left/right tilt
  
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);

  // 1. Draw Orbit Lines in 3D Perspective
  ctx.lineWidth = 1;
  const orbitRadii = [95, 160, 220];
  
  orbitRadii.forEach(r => {
    ctx.beginPath();
    // Trace 3D circle
    for (let theta = 0; theta <= Math.PI * 2 + 0.1; theta += 0.05) {
      // 3D coordinates on flat orbital plane (Y = 0)
      const x3d = r * Math.cos(theta);
      const z3d = r * Math.sin(theta);
      const y3d = 0;
      
      // Rotate Pitch (around X axis)
      const yTemp = y3d * cosP - z3d * sinP;
      const zTemp = z3d * cosP + y3d * sinP;
      
      // Rotate Yaw (around Y axis)
      const xRot = x3d * cosY - zTemp * sinY;
      const zRot = zTemp * cosY + x3d * sinY;
      
      // Projection to 2D
      const scale = FOV / (zRot + CAMERA_DISTANCE);
      const px = xRot * scale + centerX.value;
      const py = yTemp * scale + centerY.value;
      
      if (theta === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    
    // Gradient styling for orbits
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();
  });

  // 2. Draw Active Kinetic Wave Pulses along Orbits
  linePulses.forEach((pulse, idx) => {
    pulse.progress += pulse.speed;
    
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    
    // Draw glowing arc centered on pulse angle
    const startA = pulse.angle + pulse.progress - 0.45;
    const endA = pulse.angle + pulse.progress + 0.45;
    
    for (let theta = startA; theta <= endA; theta += 0.05) {
      const x3d = pulse.radius * Math.cos(theta);
      const z3d = pulse.radius * Math.sin(theta);
      
      const yTemp = 0 * cosP - z3d * sinP;
      const zTemp = z3d * cosP + 0 * sinP;
      const xRot = x3d * cosY - zTemp * sinY;
      const zRot = zTemp * cosY + x3d * sinY;
      
      const scale = FOV / (zRot + CAMERA_DISTANCE);
      const px = xRot * scale + centerX.value;
      const py = yTemp * scale + centerY.value;
      
      if (theta === startA) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    
    let r = 0, g = 242, b = 254; // Cyan Default
    if (pulse.accent === 'purple') { r = 191; g = 90; b = 242; }
    else if (pulse.accent === 'green') { r = 57; g = 255; b = 20; }
    else if (pulse.accent === 'orange') { r = 255; g = 159; b = 10; }
    
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0, 1 - pulse.progress / Math.PI)})`;
    ctx.stroke();
    
    // Remove completed loops
    if (pulse.progress > Math.PI * 2) {
      linePulses.splice(idx, 1);
    }
  });

  // 3. Project and update Planet Elements coordinates directly via native DOM style
  planetsData.value.forEach((p, idx) => {
    // Rotation logic: pause or decelerate speed on hover
    const currentSpeed = activePlanet.value === p.name ? p.speed * 0.12 : p.speed;
    p.angle += currentSpeed;
    if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;
    
    // Planet coordinates on Y=0 plane
    const x3d = p.radius * Math.cos(p.angle);
    const z3d = p.radius * Math.sin(p.angle);
    const y3d = 0;
    
    // Rotate pitch & yaw
    const yTemp = y3d * cosP - z3d * sinP;
    const zTemp = z3d * cosP + y3d * sinP;
    const xRot = x3d * cosY - zTemp * sinY;
    const zRot = zTemp * cosY + x3d * sinY;
    
    // Projection
    const scale = FOV / (zRot + CAMERA_DISTANCE);
    const px = xRot * scale + centerX.value;
    const py = yTemp * scale + centerY.value;
    
    // Depth indices calculation (higher Z index = front)
    const zIndex = Math.round((1000 - zRot) * 10);
    const finalScale = scale * 0.82;
    const opacity = Math.max(0.4, (1 - zRot / 300));
    
    const el = planetElRefs.value[idx];
    if (el) {
      el.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${finalScale})`;
      el.style.zIndex = zIndex;
      el.style.opacity = opacity;
    }
  });
  
  if (isVisible) {
    animationFrameId = requestAnimationFrame(updateAndRender);
  }
}

function resize() {
  if (!canvasRef.value || !wrapperRef.value) return;
  const canvas = canvasRef.value;
  const wrapper = wrapperRef.value;
  const rect = wrapper.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  // Recenter base points
  centerX.value = rect.width / 2;
  centerY.value = rect.height / 2;
}

onMounted(() => {
  resize();
  window.addEventListener('resize', resize);
  
  observer = new IntersectionObserver(([entry]) => {
    const wasVisible = isVisible;
    isVisible = entry.isIntersecting;
    if (isVisible && !wasVisible) {
      animationFrameId = requestAnimationFrame(updateAndRender);
    } else if (!isVisible && animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }, { threshold: 0.05 });

  if (wrapperRef.value) {
    observer.observe(wrapperRef.value);
  }
  
  animationFrameId = requestAnimationFrame(updateAndRender);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  if (observer) {
    observer.disconnect();
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.orbit-wrapper {
  position: relative;
  width: 100%;
  height: 380px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--squircle-radius);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  user-select: none;
  cursor: pointer;
}

.orbit-bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* Central Sun Node */
.sun-node {
  position: absolute;
  width: 48px;
  height: 48px;
  margin-left: -24px;
  margin-top: -24px;
  z-index: 10;
  pointer-events: none;
}

.sun-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 242, 254, 0.15);
  border: 2px solid var(--accent-cyan);
  box-shadow: 0 0 20px rgba(0, 242, 254, 0.55), inset 0 0 10px rgba(0, 242, 254, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sun-label {
  font-size: 0.85rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.sun-pulse {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px dashed rgba(0, 242, 254, 0.35);
  animation: spinSunPulse 22s infinite linear;
}

/* Planet Nodes */
.planet-node {
  position: absolute;
  width: 40px;
  height: 40px;
  margin-left: -20px;
  margin-top: -20px;
  z-index: 5;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.planet-body {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(12, 14, 22, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease;
}

.planet-body i {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

/* Accents color themes */
.accent-purple .planet-body { border-color: rgba(191, 90, 242, 0.5); color: var(--accent-purple); }
.accent-purple:hover .planet-body { border-color: var(--accent-purple); box-shadow: 0 0 20px rgba(191, 90, 242, 0.45); }

.accent-green .planet-body { border-color: rgba(57, 255, 20, 0.5); color: var(--accent-green); }
.accent-green:hover .planet-body { border-color: var(--accent-green); box-shadow: 0 0 20px rgba(57, 255, 20, 0.45); }

.accent-blue .planet-body { border-color: rgba(10, 132, 255, 0.5); color: var(--accent-blue); }
.accent-blue:hover .planet-body { border-color: var(--accent-blue); box-shadow: 0 0 20px rgba(10, 132, 255, 0.45); }

.accent-cyan .planet-body { border-color: rgba(0, 242, 254, 0.5); color: var(--accent-cyan); }
.accent-cyan:hover .planet-body { border-color: var(--accent-cyan); box-shadow: 0 0 20px rgba(0, 242, 254, 0.45); }

.accent-orange .planet-body { border-color: rgba(255, 159, 10, 0.5); color: var(--accent-orange); }
.accent-orange:hover .planet-body { border-color: var(--accent-orange); box-shadow: 0 0 20px rgba(255, 159, 10, 0.45); }

/* Hover scale adjustments */
.planet-node:hover .planet-body {
  transform: scale(1.22);
}

.planet-node:hover .planet-body i {
  transform: scale(1.05);
}

/* Interactive Hologram Tooltips */
.planet-tooltip {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  background: rgba(12, 14, 22, 0.9);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 0.75rem 0.95rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.75), 0 0 15px rgba(255, 255, 255, 0.05);
  z-index: 999;
  pointer-events: none;
  animation: tooltipFadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
}

.planet-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -6px;
  border-width: 6px;
  border-style: solid;
  border-color: rgba(12, 14, 22, 0.9) transparent transparent transparent;
}

.tooltip-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.35rem;
  width: 100%;
}

.tooltip-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #ffffff;
}

.tooltip-tag {
  font-size: 0.58rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
}

.tooltip-tag.purple { color: var(--accent-purple); background: rgba(191, 90, 242, 0.12); }
.tooltip-tag.green { color: var(--accent-green); background: rgba(57, 255, 20, 0.12); }
.tooltip-tag.blue { color: var(--accent-blue); background: rgba(10, 132, 255, 0.12); }
.tooltip-tag.cyan { color: var(--accent-cyan); background: rgba(0, 242, 254, 0.12); }
.tooltip-tag.orange { color: var(--accent-orange); background: rgba(255, 159, 10, 0.12); }

.tooltip-desc {
  font-size: 0.68rem;
  color: var(--text-muted);
  line-height: 1.4;
}

/* Orbit HUD */
.orbit-hud {
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  z-index: 10;
  pointer-events: none;
}

.hud-item {
  font-size: 0.65rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.05em;
}

.hud-item.text-dim {
  color: var(--text-dim);
  font-size: 0.58rem;
}

@keyframes spinSunPulse {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes tooltipFadeUp {
  0% { opacity: 0; transform: translate(-50%, 8px); }
  100% { opacity: 1; transform: translate(-50%, 0); }
}

@media (max-width: 900px) {
  .orbit-wrapper {
    height: 330px;
  }
}

@media (max-width: 480px) {
  .orbit-wrapper {
    height: 290px;
  }
  .orbit-hud {
    display: none;
  }
}
</style>
