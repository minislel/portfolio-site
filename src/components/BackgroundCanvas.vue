<template>
  <div class="global-background-container" @mousemove="handleMouseMove">
    <!-- SVG Dither Noise Texture (Eliminates Gradient Color Banding) -->
    <div class="dither-noise"></div>

    <!-- Fluid Glowing Liquid Orbs Layer -->
    <div class="fluid-orbs-layer">
      <div class="fluid-orb orb-cyan" :style="orbCyanStyle"></div>
      <div class="fluid-orb orb-purple" :style="orbPurpleStyle"></div>
      <div class="fluid-orb orb-blue" :style="orbBlueStyle"></div>
      <div class="fluid-orb orb-green" :style="orbGreenStyle"></div>
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

function handleMouseMove(e) {
  const { clientX, clientY } = e;
  const { innerWidth, innerHeight } = window;
  mouseX.value = (clientX / innerWidth - 0.5) * 60;
  mouseY.value = (clientY / innerHeight - 0.5) * 60;
}

function handleScroll() {
  scrollY.value = window.scrollY * 0.15;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const orbCyanStyle = computed(() => ({
  transform: `translate3d(${mouseX.value * 1.4}px, ${mouseY.value * 1.4 - scrollY.value}px, 0) scale(1.1)`
}));

const orbPurpleStyle = computed(() => ({
  transform: `translate3d(${-mouseX.value * 1.2}px, ${-mouseY.value * 1.2 + scrollY.value * 0.8}px, 0) scale(1)`
}));

const orbBlueStyle = computed(() => ({
  transform: `translate3d(${mouseX.value * 0.9}px, ${mouseY.value * 0.9 + scrollY.value * 0.5}px, 0) scale(1.15)`
}));

const orbGreenStyle = computed(() => ({
  transform: `translate3d(${-mouseX.value * 0.7}px, ${-mouseY.value * 0.7 - scrollY.value * 0.6}px, 0) scale(0.95)`
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
}

/* SVG Dither Noise - Eliminates all gradient color banding */
.dither-noise {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  z-index: 2;
  mix-blend-mode: overlay;
  opacity: 0.65;
}

.fluid-orbs-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  filter: blur(110px);
}

.fluid-orb {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.orb-cyan {
  width: 650px;
  height: 650px;
  background: radial-gradient(circle at center, rgba(0, 242, 254, 0.35) 0%, rgba(10, 132, 255, 0.15) 50%, transparent 80%);
  top: -10%;
  left: 10%;
  animation: floatGlobalCyan 22s infinite alternate ease-in-out;
}

.orb-purple {
  width: 700px;
  height: 700px;
  background: radial-gradient(circle at center, rgba(191, 90, 242, 0.35) 0%, rgba(94, 92, 230, 0.12) 50%, transparent 80%);
  top: 30%;
  right: -5%;
  animation: floatGlobalPurple 28s infinite alternate ease-in-out;
}

.orb-blue {
  width: 550px;
  height: 550px;
  background: radial-gradient(circle at center, rgba(10, 132, 255, 0.3) 0%, rgba(0, 242, 254, 0.1) 60%, transparent 80%);
  bottom: 5%;
  left: -5%;
  animation: floatGlobalBlue 24s infinite alternate ease-in-out;
}

.orb-green {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle at center, rgba(57, 255, 20, 0.25) 0%, rgba(10, 132, 255, 0.08) 60%, transparent 80%);
  bottom: -15%;
  right: 25%;
  animation: floatGlobalGreen 20s infinite alternate ease-in-out;
}

.tech-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.35;
  z-index: 1;
}

@keyframes floatGlobalCyan {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(80px, 100px) rotate(40deg); }
}

@keyframes floatGlobalPurple {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(-100px, -70px) rotate(-35deg); }
}

@keyframes floatGlobalBlue {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(70px, -80px) scale(1.2); }
}

@keyframes floatGlobalGreen {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-60px, 60px) scale(1.15); }
}
</style>
