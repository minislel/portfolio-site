<template>
  <section class="hero-container">
    <!-- Centered Hero Card -->
    <PortfolioCard class="hero-card" accent="cyan">
      <div class="hero-content">
        <span class="hero-badge">{{ t('.NET Backend Engineer & Builder', '.NET Backend Engineer & Builder') }}</span>
        <h1 class="hero-title">
          {{ t('Cześć! jestem', 'Hi! I am') }} <span class="gradient-text">Marcin Świderski</span>
        </h1>
        <p class="hero-subtitle">
          {{ t(
            'Kiedyś dowoziłem jedzenie, teraz dowożę rozwiązania backendowe.',
            'I used to deliver food, now I deliver backend solutions.'
          ) }}
        </p>
        <div class="hero-actions">
          <a href="#projekty" class="btn-primary">{{ t('Zobacz projekty ➔', 'View projects ➔') }}</a>
          <a href="#o-mnie" class="btn-secondary">{{ t('O mnie', 'About me') }}</a>
        </div>
      </div>
    </PortfolioCard>
  </section>
</template>

<script setup>
import PortfolioCard from './PortfolioCard.vue';
import { useLocale } from '../utils/useLocale.js';

const { t } = useLocale();
</script>

<style scoped>
.hero-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem 2rem 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

.hero-card {
  width: 100%;
  padding: 4.5rem 3rem !important;
  text-align: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.hero-badge {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-cyan);
  background: rgba(0, 242, 254, 0.1);
  border: 1px solid rgba(0, 242, 254, 0.3);
  padding: 0.4rem 1.25rem;
  border-radius: 100px;
  backdrop-filter: blur(10px);
  letter-spacing: 0.05em;
  max-width: 100%;
  word-break: break-word;
}

.hero-title {
  font-size: clamp(1.8rem, 6.5vw, 3.8rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: #ffffff;
  max-width: 900px;
  word-break: break-word;
  text-align: center;
}

.gradient-text {
  background: linear-gradient(135deg, #00f2fe 0%, #bf5af2 50%, #39ff14 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.hero-subtitle {
  font-size: clamp(0.95rem, 3vw, 1.25rem);
  color: var(--text-muted);
  max-width: 680px;
  line-height: 1.6;
  text-align: center;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-primary {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 700;
  color: #07090e;
  background: #ffffff;
  padding: 0.85rem 2rem;
  border-radius: 100px;
  text-decoration: none;
  transition: var(--transition-liquid);
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 0 35px rgba(255, 255, 255, 0.5);
  background: #ffffff;
}

.btn-secondary {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.85rem 2rem;
  border-radius: 100px;
  text-decoration: none;
  backdrop-filter: blur(10px);
  transition: var(--transition-liquid);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .hero-container {
    padding: 4.5rem 1rem 1.5rem 1rem;
    min-height: 70vh;
  }

  .hero-card {
    padding: 2.5rem 1.25rem !important;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
    gap: 0.85rem;
  }

  .btn-primary, .btn-secondary {
    width: 100%;
    text-align: center;
  }
}
</style>
