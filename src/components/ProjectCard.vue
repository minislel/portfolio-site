<template>
  <PortfolioCard :accent="accent" :class="['project-showcase-card', statusType ? 'card-status-' + statusType : '']">
    <!-- Top Image Preview Thumbnail -->
    <div v-if="image" class="card-image-wrapper">
      <img :src="image" :alt="title" :class="[statusType === 'abandoned' ? 'img-abandoned' : '']" loading="lazy" />
      <div class="image-overlay-glow"></div>

      <!-- Graphic Status Ribbons -->

      <div v-if="statusType === 'wip'" class="status-ribbon ribbon-wip">
        <span class="ribbon-pulse dot-wip"></span>
        <span class="ribbon-text">{{ t('⚡ W BUDOWIE', '⚡ WORK IN PROGRESS') }}</span>
      </div>
      <div v-else-if="statusType === 'active'" class="status-ribbon ribbon-active">
        <span class="ribbon-pulse dot-active"></span>
        <span class="ribbon-text">{{ t('🟢 AKTYWNY', '🟢 ACTIVE') }}</span>
      </div>
    </div>

    <div class="project-card-body">
      <!-- Header Row: Logo on Left, Left-Aligned Title on Right -->
      <div class="project-header-row">
        <div v-if="logoImg || logoSvg" :class="['project-logo-badge', 'logo-' + accent, statusType === 'abandoned' ? 'logo-abandoned-tint' : '', logoImg ? 'logo-img-badge' : '']">
          <img v-if="logoImg" :src="logoImg" :alt="title + ' logo'" class="logo-img" loading="lazy" />
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="logoSvg"></svg>
        </div>
        <div class="project-title-group">
          <div class="title-category-row">
            <span v-if="category" class="card-tag">{{ category }}</span>
            <span v-if="statusType === 'abandoned'" class="abandoned-tag-inline">{{ t('ARCHIWUM', 'ARCHIVE') }}</span>
          </div>
          <h3 class="card-title text-left" :class="[statusType === 'abandoned' ? 'title-abandoned' : '']">{{ title }}</h3>
        </div>
      </div>

      <p class="card-description text-left">{{ description }}</p>
      <ul v-if="bullets && bullets.length" class="project-bullet-list">
        <li v-for="(b, i) in bullets" :key="i">
          <span class="project-bullet-arrow">▸</span>
          <span class="project-bullet-item">
            <span class="project-bullet-label">{{ b.label }}</span>
            <span class="project-bullet-text">{{ b.text }}</span>
          </span>
        </li>
      </ul>
      <p v-if="funFact" class="card-fun-fact text-left"><strong>{{ funFact }}</strong></p>

      <!-- Prominent Tech Badges -->
      <div v-if="techList && techList.length" class="tech-badges-left">
        <span v-for="tech in techList" :key="typeof tech === 'object' ? tech.name : tech" class="project-tech-chip">
          <span class="tech-icon-container" v-html="getTechIconMarkup(typeof tech === 'object' ? tech.name : tech)"></span>
          <span class="tech-chip-label">{{ typeof tech === 'object' ? tech.name : tech }}</span>
        </span>
      </div>
    </div>

    <template #footer>
      <div class="project-meta">
        <span :class="['card-tag', statusType === 'abandoned' ? 'year-abandoned' : '']" style="margin-bottom: 0; font-size: 0.75rem;">
          {{ year }}
        </span>
        <div class="project-links">
          <!-- Github link -->
          <a v-if="github" :href="github" target="_blank" rel="noopener noreferrer" class="project-icon-link project-icon-link--github" aria-label="GitHub Repository">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
          <!-- Live link -->
          <a v-if="live" :href="live" target="_blank" rel="noopener noreferrer" class="project-icon-link" aria-label="Live Demo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>
      </div>
    </template>
  </PortfolioCard>
</template>

<script setup>
import PortfolioCard from './PortfolioCard.vue';
import { getTechIconMarkup } from '../utils/techIcons.js';
import { useLocale } from '../utils/useLocale.js';

const { t } = useLocale();

defineProps({
  title: {
    type: String,
    required: true
  },
  funFact: {
    type: String,
    default: ''
  },
  bullets: {
    type: Array,
    default: () => []
  },
  category: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  logoSvg: {
    type: String,
    default: ''
  },
  logoImg: {
    type: String,
    default: ''
  },
  techList: {
    type: Array,
    default: () => []
  },
  year: {
    type: String,
    default: ''
  },
  statusType: {
    type: String,
    default: '' // 'abandoned' | 'wip' | 'active'
  },
  github: {
    type: String,
    default: ''
  },
  live: {
    type: String,
    default: ''
  },
  accent: {
    type: String,
    default: 'cyan'
  }
});
</script>

<style scoped>
.project-showcase-card {
  padding: 0 !important;
  overflow: hidden;
  position: relative;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 165px;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease;
}

.img-abandoned {
  filter: grayscale(0.65) contrast(1.1) brightness(0.85);
}

.project-showcase-card:hover .img-abandoned {
  filter: grayscale(0.2) contrast(1.05) brightness(1);
  transform: scale(1.06);
}

.project-showcase-card:hover .card-image-wrapper img:not(.img-abandoned) {
  transform: scale(1.06);
}

.image-overlay-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 35%, rgba(12, 14, 22, 0.88) 100%);
  pointer-events: none;
}

.status-ribbon {
  position: absolute;
  top: 14px;
  right: 14px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  padding: 0.3rem 0.75rem;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(12, 14, 22, 0.85);
  z-index: 10;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.6);
}

.ribbon-abandoned {
  background: rgba(239, 68, 68, 0.22);
  border: 1px solid rgba(239, 68, 68, 0.6);
  color: #ff6b6b;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.35);
}

.dot-abandoned {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ff4d4d;
  box-shadow: 0 0 8px #ff4d4d;
}

.ribbon-wip {
  background: rgba(0, 242, 254, 0.18);
  border: 1px solid rgba(0, 242, 254, 0.5);
  color: #00f2fe;
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.3);
}

.dot-wip {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00f2fe;
  box-shadow: 0 0 8px #00f2fe;
  animation: pulseWip 1.8s infinite;
}

@keyframes pulseWip {
  0% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.3); }
  100% { opacity: 0.4; transform: scale(0.9); }
}

.ribbon-active {
  background: rgba(57, 255, 20, 0.18);
  border: 1px solid rgba(57, 255, 20, 0.5);
  color: #39ff14;
  box-shadow: 0 0 15px rgba(57, 255, 20, 0.3);
}

.dot-active {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #39ff14;
  box-shadow: 0 0 8px #39ff14;
}

.project-card-body {
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
}

.card-fun-fact {
  margin-top: 0.65rem;
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--text-muted);
}

.card-fun-fact strong {
  color: var(--accent-cyan);
  font-weight: 700;
}

.project-bullet-list {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.project-bullet-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
}

.project-bullet-arrow {
  color: var(--accent-cyan);
  font-size: 0.7rem;
  margin-top: 0.22rem;
  flex-shrink: 0;
  text-shadow: 0 0 6px var(--accent-cyan);
}

.project-bullet-item {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
}

.project-bullet-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent-cyan);
  opacity: 0.85;
}

.project-bullet-text {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-secondary, rgba(255,255,255,0.7));
}

.project-header-row {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  margin-bottom: 0.85rem;
}

.project-logo-badge {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  margin-top: 2px;
  overflow: hidden;
}

.logo-img-badge {
  background: transparent;
  border-color: transparent;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
}

.logo-abandoned-tint {
  border-color: rgba(239, 68, 68, 0.4) !important;
  color: #ff6b6b !important;
}

.title-category-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.abandoned-tag-inline {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  color: #ff6b6b;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.title-abandoned {
  color: rgba(255, 255, 255, 0.9) !important;
}

.year-abandoned {
  color: #ff6b6b !important;
  border-color: rgba(239, 68, 68, 0.3) !important;
  background: rgba(239, 68, 68, 0.1) !important;
}

.project-logo-badge svg {
  width: 22px;
  height: 22px;
}

.logo-purple { color: var(--accent-purple); border-color: rgba(191, 90, 242, 0.35); }
.logo-orange { color: var(--accent-orange); border-color: rgba(255, 159, 10, 0.35); }
.logo-cyan { color: var(--accent-cyan); border-color: rgba(0, 242, 254, 0.35); }
.logo-blue { color: var(--accent-blue); border-color: rgba(10, 132, 255, 0.35); }
.logo-green { color: var(--accent-green); border-color: rgba(57, 255, 20, 0.35); }

.project-title-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.text-left {
  text-align: left !important;
}

.tech-badges-left {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.project-tech-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.38rem 0.8rem;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #ffffff;
  transition: var(--transition-liquid);
}

.project-tech-chip:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.tech-icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tech-chip-label {
  line-height: 1;
}

:deep(.project-meta) {
  padding: 1rem 1.5rem !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.project-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.project-icon-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary, rgba(255,255,255,0.6));
  text-decoration: none;
  transition: all 0.25s ease;
}

.project-icon-link svg {
  width: 18px;
  height: 18px;
}

.project-icon-link--github {
  width: 46px;
  height: 46px;
  border-color: rgba(0, 242, 254, 0.3);
  background: rgba(0, 242, 254, 0.06);
  color: var(--accent-cyan);
}

.project-icon-link--github svg {
  width: 24px;
  height: 24px;
}

.project-icon-link:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.35);
  color: #fff;
  transform: translateY(-2px);
}

.project-icon-link--github:hover {
  background: rgba(0, 242, 254, 0.14);
  border-color: rgba(0, 242, 254, 0.6);
  color: var(--accent-cyan);
  box-shadow: 0 0 16px rgba(0, 242, 254, 0.25);
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .project-card-body {
    padding: 1.25rem 1rem 0.5rem 1rem;
  }
  .card-image-wrapper {
    height: 140px;
  }
  .project-logo-badge {
    width: 36px;
    height: 36px;
  }
  .project-logo-badge svg {
    width: 18px;
    height: 18px;
  }
  :deep(.project-meta) {
    padding: 0.85rem 1rem !important;
  }
}
</style>
