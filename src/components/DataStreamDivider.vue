<template>
  <div class="divider-wrapper" ref="wrapperRef">
    <canvas 
      ref="canvasRef" 
      class="divider-canvas"
      @mousemove="handleMouseMove"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  accent: {
    type: String,
    default: 'cyan' // 'cyan', 'purple', 'green', 'blue', 'orange'
  },
  pulseSpeed: {
    type: Number,
    default: 1.2
  }
});

const wrapperRef = ref(null);
const canvasRef = ref(null);

const isHovered = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);
const lerpMouseX = ref(0);
const lerpMouseY = ref(0);

// Config
const PACKET_COUNT = 15;
let packets = [];
let animationFrameId = null;

// Determine colors
const rgbColor = computed(() => {
  switch (props.accent) {
    case 'cyan': return { r: 0, g: 242, b: 254 };
    case 'purple': return { r: 191, g: 90, b: 242 };
    case 'green': return { r: 57, g: 255, b: 20 };
    case 'blue': return { r: 10, g: 132, b: 255 };
    case 'orange': return { r: 255, g: 159, b: 10 };
    default: return { r: 255, g: 255, b: 255 };
  }
});

class Packet {
  constructor(canvasWidth) {
    this.reset(canvasWidth);
    // Stagger starts
    this.x = Math.random() * canvasWidth;
  }

  reset(canvasWidth) {
    this.x = 0;
    this.y = 0;
    this.speed = (Math.random() * 1.5 + 0.8) * props.pulseSpeed;
    this.size = Math.random() * 2 + 1.2;
    this.brightness = Math.random() * 0.4 + 0.6;
    // direction: left-to-right (1) or right-to-left (-1)
    this.dir = Math.random() > 0.4 ? 1 : -1;
    if (this.dir === -1) {
      this.x = canvasWidth;
    }
  }

  update(canvasWidth) {
    this.x += this.speed * this.dir;
    
    // Check bounds
    if (this.dir === 1 && this.x > canvasWidth) {
      this.reset(canvasWidth);
    } else if (this.dir === -1 && this.x < 0) {
      this.reset(canvasWidth);
    }
  }
}

function handleMouseMove(e) {
  if (!canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  mouseX.value = e.clientX - rect.left;
  mouseY.value = e.clientY - rect.top;
}

function handleMouseEnter() {
  isHovered.value = true;
}

function handleMouseLeave() {
  isHovered.value = false;
}

function updateAndRender() {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  
  const w = canvas.width;
  const h = canvas.height;
  
  // Logical dimensions
  const dpr = window.devicePixelRatio || 1;
  const lw = w / dpr;
  const lh = h / dpr;
  
  ctx.clearRect(0, 0, lw, lh);
  
  // Smooth mouse coordinates interpolation
  lerpMouseX.value += (mouseX.value - lerpMouseX.value) * 0.1;
  lerpMouseY.value += (mouseY.value - lerpMouseY.value) * 0.1;
  
  const midY = lh / 2;
  const color = rgbColor.value;
  
  // 1. Draw glowing data bus line
  ctx.beginPath();
  
  // Draw wave with mouse distortion
  for (let x = 0; x <= lw; x += 4) {
    let y = midY;
    
    // If mouse is near, apply vertical distortion (warp bend)
    if (isHovered.value) {
      const dx = x - lerpMouseX.value;
      const dist = Math.abs(dx);
      if (dist < 120) {
        // Bend line towards mouse Y position
        const force = (1 - dist / 120) * 0.75;
        y += (lerpMouseY.value - midY) * force;
      }
    }
    
    // Add subtle ambient sine wave ripple
    y += Math.sin(x * 0.015 + Date.now() * 0.002) * 1.5;
    
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  // Baseline ambient fade
  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${isHovered.value ? 0.28 : 0.12})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Add a thin bright center core
  ctx.strokeStyle = `rgba(255, 255, 255, ${isHovered.value ? 0.35 : 0.15})`;
  ctx.lineWidth = 0.5;
  ctx.stroke();
  
  // 2. Draw packets
  packets.forEach(p => {
    p.update(lw);
    
    // Find height at packet's current position
    let px = p.x;
    let py = midY;
    
    // Apply mouse vertical pull
    if (isHovered.value) {
      const dx = px - lerpMouseX.value;
      const dist = Math.abs(dx);
      if (dist < 120) {
        const force = (1 - dist / 120) * 0.75;
        py += (lerpMouseY.value - midY) * force;
        
        // Speed up packets when close to mouse
        p.x += p.speed * 0.75 * p.dir;
      }
    }
    py += Math.sin(px * 0.015 + Date.now() * 0.002) * 1.5;
    
    // Render packet with radial glow
    const alpha = p.brightness * (isHovered.value ? 0.95 : 0.65);
    const grad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 2.5);
    grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    grad.addColorStop(0.4, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.8})`);
    grad.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, p.size * 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
  
  animationFrameId = requestAnimationFrame(updateAndRender);
}

function resize() {
  if (!canvasRef.value || !wrapperRef.value) return;
  const canvas = canvasRef.value;
  const wrapper = wrapperRef.value;
  const dpr = window.devicePixelRatio || 1;
  const rect = wrapper.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = 36 * dpr; // Static logical height of 36px
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `36px`;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
}

onMounted(() => {
  // Initialize packets
  packets = Array.from({ length: PACKET_COUNT }, () => new Packet(window.innerWidth));
  
  resize();
  window.addEventListener('resize', resize);
  
  animationFrameId = requestAnimationFrame(updateAndRender);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.divider-wrapper {
  width: 100%;
  height: 36px;
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  user-select: none;
  pointer-events: auto;
  position: relative;
  z-index: 10;
}

.divider-canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: pointer;
}
</style>
