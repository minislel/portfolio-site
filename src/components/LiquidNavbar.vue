<template>
  <nav :class="['navbar-capsule', { 'navbar-scrolled': isScrolled }]" ref="navRef">
    <!-- Left Logo & Status -->
    <div class="nav-logo-group">
      <div class="status-pulse-container">
        <span class="status-pulse"></span>
        <span class="status-dot"></span>
      </div>
      <span class="logo-text mono">M. ŚWIDERSKI</span>
    </div>

    <!-- Center Nav Links -->
    <div class="nav-links" ref="navLinksRef">
      <!-- Sliding Liquid Glass Active Pill -->
      <div 
        class="liquid-active-pill" 
        :style="pillStyle"
        :class="{ 'pill-ready': isPillReady }"
      >
        <div class="liquid-glass-inner"></div>
        <div class="liquid-glass-glow"></div>
      </div>

      <a 
        v-for="link in navLinks" 
        :key="link.href" 
        :href="link.href" 
        :ref="el => setLinkRef(el, link.id)"
        :class="['nav-link-item', { 'active': activeSection === link.id }]"
        @click.prevent="scrollToSection(link.id)"
      >
        <i :class="['nav-icon', link.icon]"></i>
        <span class="nav-label">{{ link.label }}</span>
      </a>
    </div>

    <!-- Right Accent Deco (Quick Contact Button & Language Switcher) -->
    <div class="nav-cta-group">
      <a href="mailto:marcin4kt@gmail.com" class="nav-cta-btn mono">{{ t('KONTAKT', 'EMAIL ME') }}</a>
      <button class="locale-switcher-btn" @click="toggleLocale" :title="t('Switch to English', 'Zmień na Polski')">
        <!-- Show the flag of the language that is NOT current (indicating what clicking will switch to) -->
        <img v-if="locale === 'pl'" src="https://raw.githubusercontent.com/iamcal/emoji-data/master/img-apple-64/1f1ec-1f1e7.png" alt="English" class="ios-emoji-flag" />
        <img v-else src="https://raw.githubusercontent.com/iamcal/emoji-data/master/img-apple-64/1f1f5-1f1f1.png" alt="Polski" class="ios-emoji-flag" />
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useLocale } from '../utils/useLocale.js';

const { locale, toggleLocale, t } = useLocale();
const isScrolled = ref(false);
const activeSection = ref('o-mnie');

const navLinksRef = ref(null);
const linkRefs = ref({});
const linkRects = ref({});

const pillStyle = ref({
  transform: 'translate3d(0px, 0px, 0px)',
  width: '0px',
  height: '0px',
  opacity: 0
});
const isPillReady = ref(false);

function setLinkRef(el, id) {
  if (el) {
    linkRefs.value[id] = el;
  }
}

function measureLinks() {
  const containerEl = navLinksRef.value;
  if (!containerEl) return;
  
  const containerRect = containerEl.getBoundingClientRect();
  const newRects = {};

  for (const id in linkRefs.value) {
    const el = linkRefs.value[id];
    if (el) {
      const rect = el.getBoundingClientRect();
      newRects[id] = {
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height
      };
    }
  }
  
  linkRects.value = newRects;
  updatePillPosition();
}

function updatePillPosition() {
  const currentId = activeSection.value;
  const rect = linkRects.value[currentId];

  if (rect) {
    pillStyle.value = {
      transform: `translate3d(${rect.left}px, ${rect.top}px, 0)`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      opacity: 1
    };

    if (!isPillReady.value) {
      requestAnimationFrame(() => {
        isPillReady.value = true;
      });
    }
  }
}

watch(activeSection, () => {
  updatePillPosition();
});

watch(locale, () => {
  nextTick(() => {
    measureLinks();
  });
});

const navLinks = computed(() => [
  { label: t('O mnie', 'About me'), href: '#o-mnie', id: 'o-mnie', icon: 'fa-solid fa-user' },
  { label: t('Doświadczenie', 'Experience'), href: '#doswiadczenie', id: 'doswiadczenie', icon: 'fa-solid fa-briefcase' },
  { label: t('Technologie', 'Stack'), href: '#technologie', id: 'technologie', icon: 'fa-solid fa-layer-group' },
  { label: t('Projekty', 'Projects'), href: '#projekty', id: 'projekty', icon: 'fa-solid fa-code' },
  { label: t('Aktywność', 'Activities'), href: '#activity-extras', id: 'activity-extras', icon: 'fa-solid fa-server' },
]);

let ticking = false;
let isProgrammaticScrolling = false;
let scrollTimeout = null;

function cancelProgrammaticScroll() {
  if (isProgrammaticScrolling) {
    isProgrammaticScrolling = false;
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
      scrollTimeout = null;
    }
  }
}

function handleScroll() {
  if (isProgrammaticScrolling) return;

  if (!ticking) {
    requestAnimationFrame(() => {
      if (isProgrammaticScrolling) {
        ticking = false;
        return;
      }

      isScrolled.value = window.scrollY > 40;
      
      const sections = ['o-mnie', 'doswiadczenie', 'technologie', 'projekty', 'activity-extras'];
      let currentActive = 'o-mnie';
      const viewportMiddle = window.scrollY + window.innerHeight * 0.35;
      
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (viewportMiddle >= top && viewportMiddle < top + height) {
            currentActive = id;
            break;
          }
        }
      }
      
      if (activeSection.value !== currentActive) {
        activeSection.value = currentActive;
      }
      
      ticking = false;
    });
    ticking = true;
  }
}

function scrollToSection(id) {
  isProgrammaticScrolling = true;
  if (scrollTimeout) clearTimeout(scrollTimeout);

  activeSection.value = id;
  updatePillPosition();

  const el = document.getElementById(id);
  if (el) {
    const yOffset = -90;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  // Release programmatic scroll flag after smooth scroll completes (~800ms)
  scrollTimeout = setTimeout(() => {
    isProgrammaticScrolling = false;
    scrollTimeout = null;
  }, 800);
}

let resizeObserver = null;

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', measureLinks, { passive: true });
  window.addEventListener('wheel', cancelProgrammaticScroll, { passive: true });
  window.addEventListener('touchstart', cancelProgrammaticScroll, { passive: true });
  
  if (navLinksRef.value) {
    resizeObserver = new ResizeObserver(() => {
      measureLinks();
    });
    resizeObserver.observe(navLinksRef.value);
  }

  handleScroll();
  nextTick(() => {
    measureLinks();
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', measureLinks);
  window.removeEventListener('wheel', cancelProgrammaticScroll);
  window.removeEventListener('touchstart', cancelProgrammaticScroll);
  if (scrollTimeout) clearTimeout(scrollTimeout);
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<style scoped>
.navbar-capsule {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  width: 90%;
  max-width: 1000px;
  padding: 0.55rem 1.5rem;
  border-radius: 100px;
  
  background: rgba(12, 14, 22, 0.42);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  animation: slideNavDown 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.navbar-scrolled {
  top: 1rem;
  padding: 0.45rem 1.25rem;
  background: rgba(8, 10, 16, 0.7);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* Logo Group Styles */
.nav-logo-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-pulse-container {
  position: relative;
  width: 9px;
  height: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-dot {
  width: 9px;
  height: 9px;
  background: var(--accent-green);
  border-radius: 50%;
  z-index: 2;
  box-shadow: 0 0 6px var(--accent-green);
}

.status-pulse {
  position: absolute;
  width: 17px;
  height: 17px;
  background: rgba(57, 255, 20, 0.35);
  border-radius: 50%;
  animation: pulseLogoDot 2.2s infinite ease-out;
  z-index: 1;
}

.logo-text {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #ffffff;
}

/* Navigation Links */
.nav-links {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

/* Sliding iOS Liquid Glass Active Pill */
.liquid-active-pill {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
  border-radius: 100px;
  opacity: 0;
  
  background: linear-gradient(135deg, rgba(0, 242, 254, 0.22) 0%, rgba(191, 90, 242, 0.18) 100%);
  border: 1px solid rgba(0, 242, 254, 0.5);
  box-shadow: 
    0 4px 18px rgba(0, 242, 254, 0.35),
    0 0 12px rgba(191, 90, 242, 0.25),
    inset 0 1px 1px rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  overflow: hidden;
  
  will-change: transform, width, height;
  transform-origin: 0 0;
}

/* Viscous, smooth iOS liquid glass glide - ~50% slower (0.7s) */
.liquid-active-pill.pill-ready {
  transition: 
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    width 0.65s cubic-bezier(0.16, 1, 0.3, 1),
    height 0.65s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.35s ease;
}

.liquid-glass-inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border-radius: 100px 100px 0 0;
  pointer-events: none;
}

.liquid-glass-glow {
  position: absolute;
  inset: -2px;
  background: radial-gradient(
    circle at center,
    rgba(0, 242, 254, 0.4) 0%,
    transparent 70%
  );
  opacity: 0.6;
  pointer-events: none;
}

.nav-link-item {
  position: relative;
  z-index: 2;
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
  padding: 0.5rem 1.1rem;
  border-radius: 100px;
  transition: color 0.3s ease, background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.nav-link-item:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-link-item.active {
  color: #ffffff;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(0, 242, 254, 0.7);
  background: transparent;
}

.nav-icon {
  display: none;
}

/* CTA & Switcher button group */
.nav-cta-group {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.nav-cta-btn {
  text-decoration: none;
  font-size: 0.72rem;
  font-weight: 700;
  color: #07090e;
  background: #ffffff;
  padding: 0.45rem 1.1rem;
  border-radius: 100px;
  letter-spacing: 0.05em;
  transition: var(--transition-liquid);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.25);
}

.nav-cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.45);
  background: #ffffff;
}

/* Locale switcher button (iOS style emoji) */
.locale-switcher-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.35rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-liquid);
  width: 32px;
  height: 32px;
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
}

.locale-switcher-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.08) translateY(-1px);
}

.ios-emoji-flag {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

@keyframes slideNavDown {
  0% { transform: translate(-50%, -30px); opacity: 0; }
  100% { transform: translate(-50%, 0); opacity: 1; }
}

@keyframes pulseLogoDot {
  0% { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(1.6); opacity: 0; }
}

/* Responsive adjustments */
@media (max-width: 820px) {
  .nav-cta-btn {
    display: none; /* Hide email button only, keep switcher */
  }
}

@media (max-width: 680px) {
  .navbar-capsule {
    padding: 0.45rem 0.75rem;
    width: 94%;
  }
  .nav-logo-group {
    display: none; /* Hide logo to save space */
  }
  .nav-links {
    flex-grow: 1;
    justify-content: space-around;
    gap: 0.15rem;
  }
  .nav-link-item {
    font-size: 1.15rem; /* Large touch targets */
    padding: 0.55rem 0.85rem;
    border-radius: 100px;
  }
  .nav-icon {
    display: inline-block;
  }
  .nav-label {
    display: none; /* Hide text label on mobile */
  }
}

@media (max-width: 360px) {
  .nav-link-item {
    padding: 0.5rem 0.65rem;
    font-size: 1.05rem;
  }
}
</style>
