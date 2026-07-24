<template>
  <div class="sphere-wrapper" ref="wrapperRef" @mousedown="handleMouseDown" @mouseup="handleMouseUp">
    <!-- Status HUD Overlays (Futuristic Digital Style) -->
    <div class="hudhud hud-top-left">
      <div class="hud-item blinking">
        <span class="hud-dot cyan"></span>
        <span class="hud-text mono">SYSTEM: ONLINE</span>
      </div>
      <div class="hud-item">
        <span class="hud-text-dim mono">COGNITIVE SYNC: OK</span>
      </div>
    </div>

    <div class="hudhud hud-top-right">
      <div class="hud-item">
        <span class="hud-text mono">CORE TEMP: 32°C</span>
      </div>
      <div class="hud-item">
        <span class="hud-text-dim mono">LATENCY: 11ms</span>
      </div>
    </div>

    <div class="hudhud hud-bottom-left">
      <div class="hud-item">
        <span class="hud-text-dim mono">SHOCKWAVE CHARGE: 100%</span>
      </div>
      <div class="hud-item text-small">
        <span class="hud-text-dim mono">CLICK TO DISRUPT VECTOR GRID</span>
      </div>
    </div>

    <div class="hudhud hud-bottom-right">
      <div class="hud-item">
        <span class="hud-text mono">NODES: 280</span>
      </div>
      <div class="hud-item">
        <span class="hud-text-dim mono">AXIS: {{ autoRotateSpeedY.toFixed(2) }} rad/s</span>
      </div>
    </div>

    <!-- Center Canvas -->
    <canvas 
      ref="canvasRef" 
      class="sphere-canvas"
      @mousemove="handleMouseMove"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="triggerShockwave"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const wrapperRef = ref(null);
const canvasRef = ref(null);

// Configuration
const PARTICLE_COUNT = 280;
const SPHERE_RADIUS = 130;
const CONNECTION_DISTANCE = 55; // Pixels distance to draw line
const FOV = 350; // Field of View projection
const CAMERA_DISTANCE = 400;

// State Variables
const isHovered = ref(false);
const isMouseDown = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);
const targetMouseX = ref(0);
const targetMouseY = ref(0);

// Physics & Rotations
const angleX = ref(0);
const angleY = ref(0);
const targetAngleX = ref(0);
const targetAngleY = ref(0);
const autoRotateSpeedX = ref(0.001);
const autoRotateSpeedY = ref(0.0035);

// Particle data structures
let particles = [];
let animationFrameId = null;

class Particle {
  constructor(x, y, z, id) {
    this.id = id;
    // Original sphere surface position
    this.ox = x;
    this.oy = y;
    this.oz = z;
    
    // Dynamic position
    this.x = x;
    this.y = y;
    this.z = z;
    
    // Velocity (for physics shockwaves)
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    
    // Physical spring settings
    this.spring = 0.055;  // Force pulling back
    this.damping = 0.86; // Friction damping velocity
    
    // Visual styling properties
    this.size = Math.random() * 2 + 1.2;
    this.baseColor = { r: 0, g: 242, b: 254 }; // Cyan by default
    this.colorType = 'cyan'; // 'cyan', 'purple', 'green'
    
    // Determine color cluster based on sphere quadrant
    if (y > 40 && x > 40) {
      this.baseColor = { r: 191, g: 90, b: 242 }; // Purple
      this.colorType = 'purple';
    } else if (x < -40 && y < -40) {
      this.baseColor = { r: 57, g: 255, b: 20 }; // Green
      this.colorType = 'green';
    } else if (z < -80) {
      this.baseColor = { r: 10, g: 132, b: 255 }; // Dark Blue
      this.colorType = 'blue';
    }
  }

  updatePhysics(shockwave) {
    // 1. Return-to-origin Spring Force (hooks law)
    const fx = (this.ox - this.x) * this.spring;
    const fy = (this.oy - this.y) * this.spring;
    const fz = (this.oz - this.z) * this.spring;
    
    this.vx += fx;
    this.vy += fy;
    this.vz += fz;
    
    // 2. Apply shockwave repulsion if active
    if (shockwave && shockwave.active) {
      // Calculate distance in 3D space between shockwave epicenter and particle position
      const dx = this.x - shockwave.x;
      const dy = this.y - shockwave.y;
      const dz = this.z - shockwave.z;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      
      // If the particle falls within the shockwave wave-front radius
      const diff = dist - shockwave.radius;
      if (Math.abs(diff) < 35 && dist > 0) {
        // Compute push force vector
        const force = (1.0 - Math.abs(diff) / 35) * shockwave.strength;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
        this.vz += (dz / dist) * force;
      }
    }
    
    // 3. Apply velocities & friction damping
    this.vx *= this.damping;
    this.vy *= this.damping;
    this.vz *= this.damping;
    
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
  }
}

// Active shockwave physics tracker
const shockwave = {
  active: false,
  x: 0,
  y: 0,
  z: 0,
  radius: 0,
  maxRadius: 280,
  speed: 9,
  strength: 14
};

// Initialize particles using Fibonacci Sphere layout
function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
    const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
    
    const x = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta);
    const y = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta);
    const z = SPHERE_RADIUS * Math.cos(phi);
    
    particles.push(new Particle(x, y, z, i));
  }
}

function handleMouseMove(e) {
  if (!canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  
  // Normalized mouse coords (-1 to 1)
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

function handleMouseDown() {
  isMouseDown.value = true;
}

function handleMouseUp() {
  isMouseDown.value = false;
}

// Click Canvas Event -> Trigger Shockwave
function triggerShockwave(e) {
  if (!canvasRef.value) return;
  
  // Epicenter project back to 3D space
  const rect = canvasRef.value.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  
  const sx = (e.clientX - rect.left - cx);
  const sy = (e.clientY - rect.top - cy);
  
  // Assume shockwave starts at front of sphere facing user (positive Z)
  shockwave.active = true;
  shockwave.x = sx;
  shockwave.y = sy;
  shockwave.z = 100;
  shockwave.radius = 0;
  shockwave.strength = isMouseDown.value ? 24 : 14;
}

function updateAndRender() {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  
  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  
  // Clear with transparent alpha to let backdrop canvas bleed through
  ctx.clearRect(0, 0, width, height);
  
  // 1. Expand active shockwave wavefront
  if (shockwave.active) {
    shockwave.radius += shockwave.speed;
    if (shockwave.radius > shockwave.maxRadius) {
      shockwave.active = false;
    }
  }
  
  // 2. Soft-interpolation of mouse coordinates to avoid jerky rotations
  targetMouseX.value += (mouseX.value - targetMouseX.value) * 0.08;
  targetMouseY.value += (mouseY.value - targetMouseY.value) * 0.08;
  
  // Calculate target rotation angles
  if (isHovered.value) {
    targetAngleY.value += autoRotateSpeedY.value + targetMouseX.value * 0.03;
    targetAngleX.value += autoRotateSpeedX.value - targetMouseY.value * 0.03;
  } else {
    targetAngleY.value += autoRotateSpeedY.value;
    targetAngleX.value += autoRotateSpeedX.value;
  }
  
  angleX.value += (targetAngleX.value - angleX.value) * 0.1;
  angleY.value += (targetAngleY.value - angleY.value) * 0.1;
  
  const cosX = Math.cos(angleX.value);
  const sinX = Math.sin(angleX.value);
  const cosY = Math.cos(angleY.value);
  const sinY = Math.sin(angleY.value);
  
  // 3. Project and transform particles
  const projectedParticles = [];
  
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Apply internal spring physics and shockwaves
    p.updatePhysics(shockwave);
    
    // Rotate in 3D Space (Y-axis, then X-axis)
    // Rotate Y
    let x1 = p.x * cosY - p.z * sinY;
    let z1 = p.z * cosY + p.x * sinY;
    
    // Rotate X
    let y2 = p.y * cosX - z1 * sinX;
    let z2 = z1 * cosX + p.y * sinX;
    
    // Perspective Projection to 2D
    const scale = FOV / (z2 + CAMERA_DISTANCE);
    const screenX = x1 * scale + cx;
    const screenY = y2 * scale + cy;
    
    projectedParticles.push({
      x: screenX,
      y: screenY,
      z: z2,
      scale: scale,
      colorType: p.colorType,
      color: p.baseColor,
      size: p.size * scale * 0.8,
      id: p.id
    });
  }
  
  // Sort by depth (Z index) back-to-front for proper painters algorithm layering
  projectedParticles.sort((a, b) => b.z - a.z);
  
  // 4. Draw network connection lines (Z-based transparency)
  ctx.lineWidth = 0.65;
  for (let i = 0; i < projectedParticles.length; i++) {
    const p1 = projectedParticles[i];
    
    // Skip far back particles to reduce clutter and overhead
    if (p1.z > 120) continue;
    
    let connectionsCount = 0;
    
    // Look ahead to check potential connections
    for (let j = i + 1; j < projectedParticles.length; j++) {
      if (connectionsCount > 2) break; // Limit node links for beautiful sparsity
      
      const p2 = projectedParticles[j];
      
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < CONNECTION_DISTANCE) {
        connectionsCount++;
        
        // Z-depth based opacity (Fades out when rotating to back)
        const alpha = Math.max(0, (1 - dist / CONNECTION_DISTANCE) * (1 - (p1.z + p2.z) / 400) * 0.28);
        if (alpha > 0) {
          // Color selection based on proximity type
          let r = 0, g = 242, b = 254; // Cyan Default
          if (p1.colorType === 'purple' || p2.colorType === 'purple') {
            r = 191; g = 90; b = 242;
          } else if (p1.colorType === 'green' || p2.colorType === 'green') {
            r = 57; g = 255; b = 20;
          }
          
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }
  
// Cached sprite canvases for ultra-fast GPU blitting without radial gradient allocations
const spriteCache = {};

function initSprites() {
  const colors = {
    cyan: { r: 0, g: 242, b: 254 },
    purple: { r: 191, g: 90, b: 242 },
    green: { r: 57, g: 255, b: 20 },
    blue: { r: 10, g: 132, b: 255 }
  };
  
  for (const [key, c] of Object.entries(colors)) {
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 64;
    sCanvas.height = 64;
    const sCtx = sCanvas.getContext('2d');
    
    const grad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, `rgba(${c.r}, ${c.g}, ${c.b}, 0.85)`);
    grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
    
    sCtx.fillStyle = grad;
    sCtx.beginPath();
    sCtx.arc(32, 32, 32, 0, Math.PI * 2);
    sCtx.fill();
    
    spriteCache[key] = sCanvas;
  }
}

  // 5. Draw particles using cached sprites (blazing fast GPU blitting)
  for (let i = 0; i < projectedParticles.length; i++) {
    const p = projectedParticles[i];
    const opacity = Math.max(0.12, (1 - p.z / 250) * 0.85);
    const sprite = spriteCache[p.colorType] || spriteCache.cyan;
    const drawSize = p.size * 4;
    
    ctx.globalAlpha = opacity;
    ctx.drawImage(sprite, p.x - drawSize / 2, p.y - drawSize / 2, drawSize, drawSize);
  }
  ctx.globalAlpha = 1.0;
  
  // 6. Draw physical shockwave expanding wave ring if active
  if (shockwave.active) {
    const scale = FOV / (shockwave.z + CAMERA_DISTANCE);
    const ringRad = shockwave.radius * scale;
    
    // Ring fades out as it expands
    const waveOpacity = Math.max(0, (1 - shockwave.radius / shockwave.maxRadius) * 0.35);
    
    ctx.strokeStyle = `rgba(0, 242, 254, ${waveOpacity})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, ringRad, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Queue next frame if visible
  if (isVisible) {
    animationFrameId = requestAnimationFrame(updateAndRender);
  }
}

let isVisible = true;
let observer = null;

// Adjust canvas resolution dynamically based on parent container size (Capped DPR)
function resizeCanvas() {
  if (!canvasRef.value || !wrapperRef.value) return;
  const canvas = canvasRef.value;
  const wrapper = wrapperRef.value;
  
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = wrapper.getBoundingClientRect();
  
  // Set logical dimensions matching the rect size
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  
  // Scale context to match retina screens
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
}

onMounted(() => {
  initSprites();
  initParticles();
  resizeCanvas();
  
  // Watch resize
  window.addEventListener('resize', resizeCanvas);
  
  // Intersection Observer to pause animation loop when scrolled offscreen
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
  
  // Run animation
  animationFrameId = requestAnimationFrame(updateAndRender);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
  if (observer) {
    observer.disconnect();
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.sphere-wrapper {
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
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}

.sphere-wrapper:hover {
  border-color: rgba(0, 242, 254, 0.35);
  box-shadow: 0 30px 60px rgba(0, 242, 254, 0.1);
}

.sphere-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* Digital HUD elements style */
.hudhud {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  z-index: 10;
  pointer-events: none;
}

.hud-top-left {
  top: 18px;
  left: 20px;
  text-align: left;
}

.hud-top-right {
  top: 18px;
  right: 20px;
  text-align: right;
}

.hud-bottom-left {
  bottom: 18px;
  left: 20px;
  text-align: left;
}

.hud-bottom-right {
  bottom: 18px;
  right: 20px;
  text-align: right;
}

.hud-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.hud-item.blinking .hud-dot {
  animation: blinkHudDot 1.5s infinite ease-in-out;
}

.hud-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.hud-dot.cyan {
  background: var(--accent-cyan);
  box-shadow: 0 0 8px var(--accent-cyan);
}

.hud-text {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.05em;
  line-height: 1.2;
}

.hud-text-dim {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-dim);
  letter-spacing: 0.04em;
  line-height: 1.2;
}

.text-small {
  margin-top: 0.1rem;
}

@keyframes blinkHudDot {
  0% { opacity: 0.35; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.35; transform: scale(0.9); }
}

@media (max-width: 900px) {
  .sphere-wrapper {
    height: 320px;
  }
}

@media (max-width: 480px) {
  .sphere-wrapper {
    height: 285px;
  }
  .hudhud {
    display: none; /* Hide HUD overlays on tiny screens for clarity */
  }
}
</style>
