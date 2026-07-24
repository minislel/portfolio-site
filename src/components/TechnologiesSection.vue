<template>
  <section id="technologie" class="section">
    <div class="section-header">
      <span class="section-subtitle">03 / {{ t('Umiejętności', 'Skills') }}</span>
      <h2 class="section-title">{{ t('Technologie & Stack', 'Technologies & Stack') }}</h2>
    </div>

    <div class="tech-sections-container">
      <PortfolioCard 
        v-for="cat in techCategories" 
        :key="cat.title" 
        :accent="cat.accent"
        class="tech-category-card"
      >
        <div class="category-header">
          <h3 class="category-title text-left">{{ cat.title }}</h3>
          <p class="category-description text-left">{{ cat.description }}</p>
        </div>

        <div class="tech-grid">
          <div v-for="tech in cat.techs" :key="tech" class="tech-item-chip">
            <span class="tech-icon-container" v-html="getTechIconMarkup(tech)"></span>
            <span>{{ tech }}</span>
          </div>
        </div>
      </PortfolioCard>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import PortfolioCard from './PortfolioCard.vue';
import { getTechIconMarkup } from '../utils/techIcons.js';
import { useLocale } from '../utils/useLocale.js';

const { t } = useLocale();

const techCategories = computed(() => [
  {
    title: t('🟢 Production-Ready / Daily Drivers', '🟢 Production-Ready / Daily Drivers'),
    description: t('Z tymi technologiami obcuję na co dzień i jestem z nimi w pełni obyty w zastosowaniach produkcyjnych.', 'Technologies I work with daily and am fully proficient with in production environments.'),
    accent: 'green',
    techs: [
      'C# / .NET',
      'ASP.NET',
      'Git',
      'Docker',
      'Hangfire',
      'Linux',
      'Hardware',
      'Jira',
      'Confluence',
      'Bitbucket',
      'Google Antigravity'
    ]
  },
  {
    title: t('🚀 Battle-Tested in Side-Projects', '🚀 Battle-Tested in Side-Projects'),
    description: t('Narzędzia i rozwiązana przetestowane w bojowych warunkach moich autorskich projektów oraz aplikacji komercyjnych.', 'Tools and solutions tested in battle conditions in my custom side-projects and commercial applications.'),
    accent: 'cyan',
    techs: [
      'Flutter',
      'TypeScript',
      'Datadog',
      'Webpack',
      'Vue',
      'JavaScript',
      'Bitbucket Pipelines',
      'TrueNAS SCALE'
    ]
  },
  {
    title: t('🧪 Explored & Tinkered', '🧪 Explored & Tinkered'),
    description: t('Niski poziom i technologie, które stale zgłębiam oraz badam, eksperymentując w moim środowisku laboratoryjnym.', 'Low-level and emerging technologies I constantly explore and research, experimenting in my lab environment.'),
    accent: 'purple',
    techs: [
      'Android Internals',
      'Cloudflare Tunnel',
      'Semantic Kernel'
    ]
  }
]);
</script>

<style scoped>
.tech-sections-container {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  width: 100%;
}

.tech-category-card {
  padding: 1.75rem 2rem !important;
}

.category-header {
  margin-bottom: 1.25rem;
}

.category-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.35rem;
}

.category-description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}

.text-left {
  text-align: left !important;
}

.tech-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.65rem;
}

.tech-item-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.45rem 0.95rem;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #ffffff;
  backdrop-filter: blur(12px);
  transition: var(--transition-liquid);
}

.tech-item-chip:hover {
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

@media (max-width: 640px) {
  .tech-category-card {
    padding: 1.25rem 1rem !important;
  }

  .category-title {
    font-size: 1.05rem;
  }

  .tech-item-chip {
    font-size: 0.76rem;
    padding: 0.35rem 0.75rem;
    gap: 0.4rem;
  }
}
</style>
