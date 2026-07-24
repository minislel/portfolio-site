<template>
  <section id="doswiadczenie" class="section timeline-section">
    <div class="section-header">
      <span class="section-subtitle">{{ t('02 / Droga', '02 / Pathway') }}</span>
      <h2 class="section-title">{{ t('Doświadczenie & Edukacja', 'Experience & Education') }}</h2>
    </div>

    <div 
      class="timeline-scroll-wrapper"
      @mouseenter="stopAutoScroll"
      @mouseleave="startAutoScroll"
    >
      <!-- Left / Right Control Buttons -->
      <button class="scroll-arrow arrow-left" @click="scrollLeftBtn" :aria-label="t('Przesuń w lewo', 'Scroll left')">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button class="scroll-arrow arrow-right" @click="scrollRightBtn" :aria-label="t('Przesuń w prawo', 'Scroll right')">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>

      <!-- Scrollable Container with Wide Edge Fades -->
      <div 
        class="timeline-scroll-container" 
        ref="scrollContainer"
        @touchstart.passive="handleTouchStart"
        @touchmove.passive="handleTouchMove"
        @touchend.passive="handleTouchEnd"
        @scroll.passive="handleManualScroll"
      >
        <div class="timeline-track-inner">
          <div v-for="(item, index) in timelineItems" :key="index" class="timeline-item-block">
            <!-- Timeline Top Node -->
            <div class="timeline-node">
              <span class="node-year">{{ item.year }}</span>
              <div :class="['node-dot', 'dot-' + item.color]"></div>
            </div>

            <!-- Card -->
            <div :class="['portfolio-card', 'timeline-card', 'accent-border-' + item.color]">
              <div class="company-header">
                <div 
                  :class="[
                    'company-logo', 
                    'logo-' + item.color, 
                    { 'zsp-logo-clickable': item.logoImg === zspLogo }
                  ]"
                  @click="item.logoImg === zspLogo ? openKubsikPopup() : null"
                  :title="item.logoImg === zspLogo ? t('Kliknij mnie! 🥚', 'Click me! 🥚') : null"
                >
                  <img v-if="item.logoImg" :src="item.logoImg" :alt="item.company" class="logo-image" loading="lazy" />
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="item.iconSvg"></svg>
                </div>
                <div class="company-info">
                  <span class="company-name">{{ item.company }}</span>
                  <span class="company-role">{{ item.role }}</span>
                </div>
              </div>
              <div class="card-date-badge">{{ item.dateRange }}</div>
              <p class="card-description">{{ item.description }}</p>
              
              <!-- Tech Badges -->
              <div class="tech-badges">
                <span v-for="tech in item.techs" :key="tech" class="tech-badge-with-icon">
                  <span class="tech-icon-container" v-html="getTechIconMarkup(tech)"></span>
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Kubsik Easter Egg Popup -->
    <Teleport to="body">
      <Transition name="fade-scale">
        <div v-if="isPopupOpen" class="kubsik-popup-overlay" @click.self="closeKubsikPopup">
          <div class="kubsik-popup-content">
            <div class="kubsik-card">
              <button class="kubsik-close-btn" @click="closeKubsikPopup" :aria-label="t('Zamknij', 'Close')">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div class="kubsik-header">
                <span class="kubsik-badge">Easter Egg 🥚</span>
                <h3 class="kubsik-title">Kubsik w akcji!</h3>
              </div>

              <div class="kubsik-gif-wrapper">
                <video :src="kubsikMedia" autoplay loop muted playsinline class="kubsik-gif-media"></video>
              </div>

              <p class="kubsik-footer-text">
                ZSP w Krynicy-Zdroju (2018 - 2022) • Nostalgia mode active
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getTechIconMarkup } from '../utils/techIcons.js';
import { useLocale } from '../utils/useLocale.js';
import zspLogo from '../assets/zsp.webp';
import spzozLogo from '../assets/spzoz-krynica.webp';
import wseiLogo from '../assets/wsei.webp';
import maximaLogo from '../assets/maxima.webp';
import kubsikMedia from '../assets/kubsik.mp4';

const { t } = useLocale();

const isPopupOpen = ref(false);

function openKubsikPopup() {
  isPopupOpen.value = true;
  document.body.style.overflow = 'hidden';
}

function closeKubsikPopup() {
  isPopupOpen.value = false;
  document.body.style.overflow = '';
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && isPopupOpen.value) {
    closeKubsikPopup();
  }
};
const scrollContainer = ref(null);
let autoScrollAnimId = null;
let resumeTimeout = null;
let userActivityTimeout = null;
let touchUserActive = false;
let scrollSpeed = 0.55; 
let scrollDirection = 1; 
let isTimelineVisible = true;
let timelineObserver = null;

function stepAutoScroll() {
  if (!isTimelineVisible || touchUserActive || !scrollContainer.value) {
    autoScrollAnimId = null;
    return;
  }

  const el = scrollContainer.value;
  const maxScroll = el.scrollWidth - el.clientWidth;
  if (maxScroll > 0) {
    if (scrollDirection === 1) {
      el.scrollLeft += scrollSpeed;
      if (el.scrollLeft >= maxScroll - 1) {
        scrollDirection = -1;
      }
    } else {
      el.scrollLeft -= scrollSpeed;
      if (el.scrollLeft <= 1) {
        scrollDirection = 1;
      }
    }
  }
  
  autoScrollAnimId = requestAnimationFrame(stepAutoScroll);
}

function startAutoScroll() {
  if (autoScrollAnimId || touchUserActive) return;
  if (resumeTimeout) clearTimeout(resumeTimeout);
  
  resumeTimeout = setTimeout(() => {
    if (autoScrollAnimId || touchUserActive) return;
    autoScrollAnimId = requestAnimationFrame(stepAutoScroll);
  }, 1000);
}

function stopAutoScroll() {
  if (userActivityTimeout) {
    clearTimeout(userActivityTimeout);
    userActivityTimeout = null;
  }
  if (resumeTimeout) {
    clearTimeout(resumeTimeout);
    resumeTimeout = null;
  }
  if (autoScrollAnimId) {
    cancelAnimationFrame(autoScrollAnimId);
    autoScrollAnimId = null;
  }
}

function handleTouchStart() {
  touchUserActive = true;
  stopAutoScroll();
}

function handleTouchMove() {
  touchUserActive = true;
  stopAutoScroll();
}

function handleTouchEnd() {
  touchUserActive = false;
  scheduleAutoScrollResume();
}

function handleManualScroll() {
  if (touchUserActive) {
    stopAutoScroll();
    scheduleAutoScrollResume();
  }
}

function scheduleAutoScrollResume() {
  if (userActivityTimeout) clearTimeout(userActivityTimeout);
  userActivityTimeout = setTimeout(() => {
    if (!touchUserActive) {
      startAutoScroll();
    }
  }, 4000);
}

onMounted(() => {
  timelineObserver = new IntersectionObserver(([entry]) => {
    const wasVis = isTimelineVisible;
    isTimelineVisible = entry.isIntersecting;
    if (isTimelineVisible && !wasVis) {
      startAutoScroll();
    } else if (!isTimelineVisible) {
      stopAutoScroll();
    }
  }, { threshold: 0.05 });

  if (scrollContainer.value) {
    timelineObserver.observe(scrollContainer.value);
  }

  startAutoScroll();
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  stopAutoScroll();
  if (timelineObserver) timelineObserver.disconnect();
  if (userActivityTimeout) clearTimeout(userActivityTimeout);
  window.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});

const timelineItems = computed(() => [
  {
    year: '09/2018',
    color: 'purple',
    company: 'ZSP w Krynicy-Zdroju',
    role: t('Technik Informatyk', 'IT Technician'),
    dateRange: '09/2018 - 05/2022',
    description: t(
      'Baza, od której wszystko się zaczęło - od rozkręcania PC-tów i stawiania Windows Servera, po pierwsze linijki kodu w PHP i C++. Praktyczny poligon doświadczalny z zakresu sieci i web devu.',
      'The foundation where it all started - from disassembling PCs and setting up Windows Server, to writing first lines of code in PHP and C++. A practical sandbox for networks and web dev.'
    ),
    techs: ['Windows Server', 'Podstawy sieci', 'C++', 'PHP / JS'],
    iconSvg: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>',
    logoImg: zspLogo
  },
  {
    year: '02/2021',
    color: 'blue',
    company: 'Szpital SPZOZ w Krynicy-Zdroju',
    role: t('Praktykant IT', 'IT Intern'),
    dateRange: '02/2021 - 03/2021',
    description: t(
      'Operational Helpdesk w środowisku szpitalnym, inwentaryzacja hardware\'u oraz wsparcie użytkowników końcowych. Projektowanie piktogramów i infografik z pakietem Adobe i MS Office.',
      'Operational Helpdesk in a hospital environment, hardware inventory, and end-user support. Design of pictograms and infographics using Adobe and MS Office suites.'
    ),
    techs: ['Helpdesk', 'Linux', 'Hardware', 'Adobe'],
    iconSvg: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>',
    logoImg: spzozLogo
  },
  {
    year: '10/2023',
    color: 'green',
    company: 'WSEI w Krakowie',
    role: t('Informatyka Stosowana (inż.)', 'Applied Computer Science (B.Eng.)'),
    dateRange: t('10/2023 - Wiosna 2027', '10/2023 - Spring 2027'),
    description: t(
      'Rozwój inżynieryjny w obszarze budowania aplikacji webowych, backendu (.NET/C#) i baz danych, połączony z pracą w samorządzie studenckim. Współorganizacja hackathonów i targów uczelnianych.',
      'Engineering development in web applications, backend (.NET/C#), and databases, combined with active work in the Student Government. Co-organizing hackathons and university job fairs.'
    ),
    techs: ['C# / .NET', 'ASP.NET MVC', 'OOP', 'Bazy Danych'],
    iconSvg: '<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><circle cx="12" cy="12" r="3"></circle>',
    logoImg: wseiLogo
  },
  {
    year: '10/2025',
    color: 'orange',
    company: 'Maxima Consulting',
    role: t('Software Engineer Intern', 'Software Engineer Intern'),
    dateRange: '10/2025 - 12/2025',
    description: t(
      'Intensywne wdrożenie w architekturę oprogramowania, procesy wytwórcze oraz domenę złożonego projektu korporacyjnego. Komercyjne REST API, praca z Git oraz codzienny Scrum w międzynarodowym zespole.',
      'Intense onboarding into software architecture, software processes, and a complex enterprise domain. Commercial REST API, work with Git, and daily Scrum in a cross-border team.'
    ),
    techs: ['C# / .NET', 'REST API', 'Git', 'Scrum / Agile'],
    iconSvg: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.26-1.5 1.5-2.5h-2c-1 0-1.79-.5-2.5-1.5z"></path><path d="M12 15l-3-3m0 0l3-3m-3 3h12"></path><path d="M15 9l-3-3 3-3"></path>',
    logoImg: maximaLogo
  },
  {
    year: '01/2026',
    color: 'cyan',
    company: 'Maxima Consulting',
    role: t('Junior .NET Engineer', 'Junior .NET Engineer'),
    dateRange: '01/2026 - 06/2026',
    description: t(
      'Rozwój produkcyjnego kodu .NET (REST API) w międzynarodowym projekcie integracyjnym WMS dla klienta z USA. Autorska biblioteka APM w Hangfire, testy jednostkowe oraz udział w procesie deploymentu.',
      'Developing production-grade .NET code (REST API) in a global WMS integration project for a client in the US. Custom APM library in Hangfire, unit testing, and participating in deployments.'
    ),
    techs: ['C# / .NET', 'Hangfire & APM', 'Datadog'],
    iconSvg: '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',
    logoImg: maximaLogo
  }
]);

function scrollLeftBtn() {
  scrollDirection = -1;
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -300, behavior: 'smooth' });
  }
}

function scrollRightBtn() {
  scrollDirection = 1;
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
</script>

<style scoped>
.timeline-section {
  padding: 4rem 0;
  overflow: visible;
}

.timeline-scroll-wrapper {
  position: relative;
  width: 100%;
  max-width: 1350px;
  margin: 0 auto;
  padding: 0 0.5rem;
}

.scroll-arrow {
  position: absolute;
  top: 55%;
  transform: translateY(-50%);
  z-index: 30;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(12, 14, 22, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-liquid);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}

.scroll-arrow:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-50%) scale(1.1);
}

.arrow-left { left: -10px; }
.arrow-right { right: -10px; }

.timeline-scroll-container {
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  padding: 4.5rem 4rem 3rem 4rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
  mask-image: linear-gradient(to right, transparent 0%, black 100px, black calc(100% - 100px), transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 100px, black calc(100% - 100px), transparent 100%);
}

.timeline-scroll-container::-webkit-scrollbar {
  display: none;
}

.timeline-track-inner {
  display: flex;
  gap: 1.5rem;
  position: relative;
  min-width: max-content;
}

.timeline-item-block {
  position: relative;
  flex: 0 0 350px;
  width: 350px;
  display: flex;
  flex-direction: column;
}

.timeline-node {
  position: absolute;
  top: -3.8rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  z-index: 3;
}

.node-year {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
  background: rgba(18, 22, 35, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 0.2rem 0.65rem;
  border-radius: 100px;
  white-space: nowrap;
}

.node-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--bg-dark);
  border: 3px solid #ffffff;
  transition: transform 0.3s ease;
}

.dot-purple { border-color: var(--accent-purple); box-shadow: 0 0 10px var(--accent-purple); }
.dot-blue { border-color: var(--accent-blue); box-shadow: 0 0 10px var(--accent-blue); }
.dot-green { border-color: var(--accent-green); box-shadow: 0 0 10px var(--accent-green); }
.dot-orange { border-color: var(--accent-orange); box-shadow: 0 0 10px var(--accent-orange); }
.dot-cyan { border-color: var(--accent-cyan); box-shadow: 0 0 10px var(--accent-cyan); }

.timeline-card {
  padding: 1.5rem 1.25rem;
  height: 100%;
}

.card-date-badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.company-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  text-align: left;
}

.company-logo {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.company-logo svg {
  width: 20px;
  height: 20px;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
  padding: 4px;
}

.logo-purple { color: var(--accent-purple); border-color: rgba(191, 90, 242, 0.3); }
.logo-blue { color: var(--accent-blue); border-color: rgba(10, 132, 255, 0.3); }
.logo-green { color: var(--accent-green); border-color: rgba(57, 255, 20, 0.3); }
.logo-orange { color: var(--accent-orange); border-color: rgba(255, 159, 10, 0.3); }
.logo-cyan { color: var(--accent-cyan); border-color: rgba(0, 242, 254, 0.3); }

.company-info {
  display: flex;
  flex-direction: column;
}

.company-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
}

.company-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.65);
}

.tech-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 1rem;
}

.tech-badge-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 0.25rem 0.65rem;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.tech-icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .scroll-arrow {
    display: none;
  }

  .timeline-scroll-container {
    padding: 3.5rem 0.5rem 2rem 0.5rem;
    mask-image: none;
    -webkit-mask-image: none;
  }

  .timeline-item-block {
    flex: 0 0 280px;
    width: 280px;
  }
}

/* Easter Egg Clickable Logo */
.zsp-logo-clickable {
  cursor: pointer;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}

.zsp-logo-clickable:hover {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 0 15px rgba(191, 90, 242, 0.6);
  border-color: rgba(191, 90, 242, 0.8) !important;
}

.zsp-logo-clickable::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  border: 1px solid var(--accent-purple);
  opacity: 0.5;
  animation: pulse-ring 2s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
  pointer-events: none;
}

@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 0; }
  100% { transform: scale(0.95); opacity: 0; }
}

/* Easter Egg Popup Transitions */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.3s ease;
}

.fade-scale-enter-active .kubsik-card,
.fade-scale-leave-active .kubsik-card {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
}

.fade-scale-enter-from .kubsik-card {
  transform: scale(0.9) translateY(10px);
  opacity: 0;
}

.fade-scale-leave-to .kubsik-card {
  transform: scale(0.95);
  opacity: 0;
}

/* Modal Overlay styling */
.kubsik-popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(4, 5, 10, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* Modal Content positioning */
.kubsik-popup-content {
  width: 100%;
  max-width: 520px;
  position: relative;
}

/* The Card itself */
.kubsik-card {
  background: rgba(15, 18, 30, 0.75);
  border: 1px solid rgba(191, 90, 242, 0.3);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 
              0 0 30px rgba(191, 90, 242, 0.15), 
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* Close Button styling */
.kubsik-close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 10;
}

.kubsik-close-btn:hover {
  background: rgba(191, 90, 242, 0.2);
  border-color: rgba(191, 90, 242, 0.4);
  color: #ffffff;
  transform: rotate(90deg) scale(1.05);
}

/* Header Styles */
.kubsik-header {
  margin-bottom: 1.25rem;
}

.kubsik-badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-purple);
  background: rgba(191, 90, 242, 0.12);
  border: 1px solid rgba(191, 90, 242, 0.25);
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.kubsik-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Gif Wrapper styling */
.kubsik-gif-wrapper {
  width: 100%;
  aspect-ratio: 4 / 3;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.6);
}

.kubsik-gif-media {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.kubsik-footer-text {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}
</style>
