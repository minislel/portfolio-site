<template>
  <div class="global-background-container" @mousemove="handleMouseMove">
    <!-- SVG Dither Noise Texture (Lightweight static micro-noise) -->
    <div class="dither-noise"></div>

    <!-- Fluid Glowing Liquid Orbs Layer -->
    <div class="fluid-orbs-layer">
      <div class="orb-wrapper" :style="orbCyanStyle">
        <div class="fluid-orb orb-cyan"></div>
      </div>
      <div class="orb-wrapper" :style="orbPurpleStyle">
        <div class="fluid-orb orb-purple"></div>
      </div>
      <div class="orb-wrapper" :style="orbBlueStyle">
        <div class="fluid-orb orb-blue"></div>
      </div>
      <div class="orb-wrapper" :style="orbGreenStyle">
        <div class="fluid-orb orb-green"></div>
      </div>
    </div>

    <!-- Tech Grid Overlay -->
    <div class="tech-grid"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const mouseX = ref(0);
const mouseY = ref(0);
const scrollY = ref(0);
let ticking = false;

function handleMouseMove(e) {
  if (!ticking) {
    requestAnimationFrame(() => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.value = (clientX / innerWidth - 0.5) * 50;
      mouseY.value = (clientY / innerHeight - 0.5) * 50;
      ticking = false;
    });
    ticking = true;
  }
}

function handleScroll() {
  scrollY.value = window.scrollY * 0.12;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const orbCyanStyle = computed(() => ({
  transform: `translate3d(${mouseX.value * 1.2}px, ${mouseY.value * 1.2 - scrollY.value}px, 0)`
}));

const orbPurpleStyle = computed(() => ({
  transform: `translate3d(${-mouseX.value * 1.0}px, ${-mouseY.value * 1.0 + scrollY.value * 0.7}px, 0)`
}));

const orbBlueStyle = computed(() => ({
  transform: `translate3d(${mouseX.value * 0.8}px, ${mouseY.value * 0.8 + scrollY.value * 0.4}px, 0)`
}));

const orbGreenStyle = computed(() => ({
  transform: `translate3d(${-mouseX.value * 0.6}px, ${-mouseY.value * 0.6 - scrollY.value * 0.5}px, 0)`
}));
</script>

<style scoped>
.global-background-container {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: -10;
  overflow: hidden;
  background-color: #06070a;
  pointer-events: none;
  contain: strict;
  transform: translateZ(0);
}

/* Static Micro Noise Texture - No heavy GPU shader fractal noise calculations */
.dither-noise {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%23ffffff' fill-opacity='0.035'%3E%3Cpath d='M0 0h1v1H0zM4 2h1v1H4zM2 4h1v1H2zM6 6h1v1H6zM7 1h1v1H7zM3 7h1v1H3z'/%3E%3C/g%3E%3C/svg%3E");
  z-index: 2;
  opacity: 0.5;
  pointer-events: none;
}

.fluid-orbs-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  filter: blur(48px);
  transform: translateZ(0);
  will-change: transform;
}

.orb-wrapper {
  position: absolute;
  inset: 0;
  pointer-events: none;
  will-change: transform;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.fluid-orb {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
}

.orb-cyan {
  width: 680px;
  height: 680px;
  background: radial-gradient(circle at center, rgba(0, 242, 254, 0.28) 0%, rgba(10, 132, 255, 0.12) 45%, rgba(10, 132, 255, 0.03) 70%, transparent 100%);
  top: -10%;
  left: 10%;
  animation: floatGlobalCyan 22s infinite alternate ease-in-out;
}

.orb-purple {
  width: 720px;
  height: 720px;
  background: radial-gradient(circle at center, rgba(191, 90, 242, 0.28) 0%, rgba(94, 92, 230, 0.1) 45%, rgba(94, 92, 230, 0.02) 70%, transparent 100%);
  top: 30%;
  right: -5%;
  animation: floatGlobalPurple 28s infinite alternate ease-in-out;
}

.orb-blue {
  width: 580px;
  height: 580px;
  background: radial-gradient(circle at center, rgba(10, 132, 255, 0.25) 0%, rgba(0, 242, 254, 0.08) 50%, transparent 100%);
  bottom: 5%;
  left: -5%;
  animation: floatGlobalBlue 24s infinite alternate ease-in-out;
}

.orb-green {
  width: 520px;
  height: 520px;
  background: radial-gradient(circle at center, rgba(57, 255, 20, 0.2) 0%, rgba(10, 132, 255, 0.06) 50%, transparent 100%);
  bottom: -15%;
  right: 25%;
  animation: floatGlobalGreen 20s infinite alternate ease-in-out;
}

.tech-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.35;
  z-index: 1;
}

@keyframes floatGlobalCyan {
  0% { transform: translate(0, 0) scale(1) rotate(0deg); }
  100% { transform: translate(70px, 90px) scale(1.1) rotate(40deg); }
}

@keyframes floatGlobalPurple {
  0% { transform: translate(0, 0) scale(1) rotate(0deg); }
  100% { transform: translate(-90px, -60px) scale(1.08) rotate(-35deg); }
}

@keyframes floatGlobalBlue {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(60px, -70px) scale(1.15); }
}

@keyframes floatGlobalGreen {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-50px, 50px) scale(1.12); }
}
</style>
