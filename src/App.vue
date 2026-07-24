<script setup>
import { ref, onMounted } from 'vue';
import { useLocale } from './utils/useLocale.js';
import BackgroundCanvas from './components/BackgroundCanvas.vue';
import LiquidNavbar from './components/LiquidNavbar.vue';
import DataStreamDivider from './components/DataStreamDivider.vue';
import HeroSection from './components/HeroSection.vue';
import AboutMe from './components/AboutMe.vue';
import ExperienceSection from './components/ExperienceSection.vue';
import ProjectsSection from './components/ProjectsSection.vue';
import ActivitySection from './components/ActivitySection.vue';
import TechnologiesSection from './components/TechnologiesSection.vue';

const { t } = useLocale();
const scrollPercentage = ref(0);

function handleScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollPercentage.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Intersection Observer for Section Reveal Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px', // Trigger slightly before the section reaches view
    threshold: 0.08
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, observerOptions);
  
  const sections = document.querySelectorAll('.section');
  sections.forEach((sec) => {
    observer.observe(sec);
  });
});
</script>

<template>
  <div class="app-wrapper">
    <!-- Sticky Liquid Glass Navbar -->
    <LiquidNavbar />

    <!-- Top Scroll Progress bar -->
    <div class="scroll-progress" :style="{ width: scrollPercentage + '%' }"></div>

    <!-- Full-screen Continuous Dithered Dynamic Backdrop -->
    <BackgroundCanvas />

    <!-- Main Content -->
    <main class="container">
      <HeroSection />
      
      <DataStreamDivider accent="purple" />
      <AboutMe />
      
      <DataStreamDivider accent="green" />
      <ExperienceSection />
      
      <DataStreamDivider accent="orange" />
      <TechnologiesSection />
      
      <DataStreamDivider accent="cyan" />
      <ProjectsSection />
      
      <DataStreamDivider accent="blue" />
      <ActivitySection />
    </main>

    <!-- Footer -->
    <footer>
      <div class="container footer-content">
        <p class="footer-tech" v-html="t('Strona stworzona w technologii <span>Vue 3</span>; Zbudowane przeze mnie i mojego ziomka gemini 3.5💪🦾', 'Website built with <span>Vue 3</span>  Built by me and my bro gemini 3.5 💪🦾')"></p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3.5px;
  background: linear-gradient(to right, #00f2fe, #bf5af2, #39ff14);
  z-index: 99999;
  transition: width 0.08s ease-out;
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.7);
}

main {
  flex-grow: 1;
}

footer {
  margin-top: 5rem;
  padding: 3rem 1.5rem;
  background: rgba(12, 14, 22, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 10;
  position: relative;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  font-size: 0.88rem;
  color: var(--text-dim);
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-text {
  font-weight: 500;
}

.footer-tech span {
  color: var(--accent-cyan);
  font-weight: 600;
  font-family: var(--font-mono);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 0.6rem;
  }
}
</style>
