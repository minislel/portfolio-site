<template>
  <div 
    ref="cardRef"
    :class="['portfolio-card', accentClass, { 'is-hovered': isHovered }]" 
    :style="cardStyle"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Dynamic Spotlight Glow Layer -->
    <div class="card-spotlight" :style="spotlightStyle"></div>
    
    <!-- Dynamic Glare/Reflection Layer -->
    <div class="card-glare" :style="glareStyle"></div>

    <div class="card-inner">
      <div v-if="tag" class="card-tag">{{ tag }}</div>
      <h3 v-if="title" class="card-title">{{ title }}</h3>
      <slot></slot>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: false
  },
  tag: {
    type: String,
    required: false
  },
  accent: {
    type: String,
    default: '' // 'cyan', 'green', 'purple', 'blue', 'orange'
  },
  tiltAmount: {
    type: Number,
    default: 8 // Maximum tilt angle in degrees
  }
});

const cardRef = ref(null);
const isHovered = ref(false);

const mouseX = ref(0);
const mouseY = ref(0);
const relX = ref(0.5); // 0 to 1
const relY = ref(0.5); // 0 to 1

const accentClass = computed(() => {
  if (!props.accent) return '';
  return `accent-border-${props.accent}`;
});

const spotlightColor = computed(() => {
  switch (props.accent) {
    case 'cyan': return 'rgba(0, 242, 254, 0.16)';
    case 'purple': return 'rgba(191, 90, 242, 0.16)';
    case 'green': return 'rgba(57, 255, 20, 0.16)';
    case 'blue': return 'rgba(10, 132, 255, 0.16)';
    case 'orange': return 'rgba(255, 159, 10, 0.16)';
    default: return 'rgba(255, 255, 255, 0.08)';
  }
});

function handleMouseMove(e) {
  if (!cardRef.value) return;
  const rect = cardRef.value.getBoundingClientRect();
  
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  mouseX.value = x;
  mouseY.value = y;
  
  relX.value = x / rect.width;
  relY.value = y / rect.height;
  
  // Set traditional CSS variables as fallback or for external animations
  cardRef.value.style.setProperty('--mouse-x', `${x}px`);
  cardRef.value.style.setProperty('--mouse-y', `${y}px`);
}

function handleMouseEnter() {
  isHovered.value = true;
}

function handleMouseLeave() {
  isHovered.value = false;
  relX.value = 0.5;
  relY.value = 0.5;
}

// Inline transform styles for performant 3D tilt
const cardStyle = computed(() => {
  if (!isHovered.value) {
    return {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease'
    };
  }
  
  const rotateX = (0.5 - relY.value) * props.tiltAmount; // Tilt up/down
  const rotateY = (relX.value - 0.5) * props.tiltAmount; // Tilt left/right
  
  return {
    transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`,
    transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.4s ease, box-shadow 0.4s ease'
  };
});

// Spotlight style tracking cursor
const spotlightStyle = computed(() => {
  return {
    background: `radial-gradient(350px circle at ${mouseX.value}px ${mouseY.value}px, ${spotlightColor.value} 0%, transparent 80%)`,
    opacity: isHovered.value ? 1 : 0
  };
});

// Glare style reflecting cursor angles
const glareStyle = computed(() => {
  if (!cardRef.value) return { opacity: 0 };
  
  // Calculate relative angle from card center
  const cx = cardRef.value.clientWidth / 2;
  const cy = cardRef.value.clientHeight / 2;
  const angle = Math.atan2(mouseY.value - cy, mouseX.value - cx) * (180 / Math.PI);
  
  return {
    background: `linear-gradient(${angle - 90}deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 65%)`,
    opacity: isHovered.value ? 1 : 0
  };
});
</script>

<style scoped>
.portfolio-card {
  position: relative;
  transform-style: preserve-3d;
}

.card-spotlight {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  transition: opacity 0.4s ease;
}

.card-glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  transition: opacity 0.4s ease;
  border-radius: inherit;
}

.card-inner {
  position: relative;
  z-index: 3;
  width: 100%;
}
</style>
