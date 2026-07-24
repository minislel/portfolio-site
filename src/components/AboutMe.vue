<template>
  <section id="o-mnie" class="section">
    <div class="section-header">
      <span class="section-subtitle">{{ t('01 / Profil', '01 / Profile') }}</span>
      <h2 class="section-title">{{ t('O mnie', 'About me') }}</h2>
    </div>
    
    <!-- Row 1: Photo (33%) & Kim jestem (67%) -->
    <div class="about-grid-row-1">
      <!-- Card 1: Photo (33%) -->
      <PortfolioCard class="photo-card" accent="purple">
        <div class="photo-wrapper">
          <img :src="currentAvatar" alt="Marcin Świderski" />
        </div>
      </PortfolioCard>

      <!-- Card 2: Kim jestem? (67%) -->
      <PortfolioCard :title="t('Kim jestem?', 'Who am I?')" :tag="t('Biogram', 'Bio')" accent="cyan">
        <ul>

        
        <p class="card-description text-left">
          {{ t(
            'Projektuję i wdrażam systemy w ekosystemie .NET, od czystej logiki biznesowej przez integracje z AI, po własną infrastrukturę serwerową.',
            'I design and deploy systems in the .NET ecosystem, from pure business logic through AI integrations to my own server infrastructure.'
          ) }}
        </p>
        <p class="card-description text-left" style="margin-top: 1rem;">
          {{ t(
            'Nie kręci mnie lanie wody o „pasji do kodu”. Wolę budować działające produkty, stawiać kontenery w domowym homelabie i dłubać w sprzęcie. Łączę backend z podejściem DevOps, bo lubię mieć pewność, że to, co napisałem, działa stabilnie od A do Z. Nie boję się wejść w dół stosu technicznego - niezależnie od tego, czy trzeba zoptymalizować zapytanie w SQL, ogarnąć konteneryzację w Dockerze, czy zdiagnozować problem fizycznie na płycie głównej.',
            'I\'m not interested in fluff about "passion for code." I prefer building working products, running containers in my homelab, and tinkering with hardware. I combine backend engineering with a DevOps mindset because I like to make sure that what I wrote runs reliably end-to-end. I\'m not afraid to dig down the tech stack - whether it\'s optimizing an SQL query, setting up Docker containerization, or physically diagnosing a motherboard issue.'
          ) }}
        </p>
        <p class="card-description text-left" style="margin-top: 1rem;">
          {{ t(
            'Poza byciem developerem, interesuję się elektroniką, sieciami komputerowymi i projektami DIY. Lutuję, składam, konfiguruję, testuję, naprawiam... i czasem coś wybucha. Ale to część zabawy.',
            'Outside of development, I\'m interested in electronics, computer networks, and DIY projects. I solder, build, configure, test, repair... and sometimes things explode. But that\'s part of the fun.'
          ) }}
        </p>
        </ul>
      </PortfolioCard>
    </div>

    <!-- Row 2: Kontakt & Sociale (Full Width) -->
    <div class="about-grid-row-2">
      <PortfolioCard :title="t('Kontakt & Sociale', 'Contact & Socials')" :tag="t('Połączmy się', 'Connect')" accent="blue" class="contact-full-card">
        <div class="contact-grid">
          <div class="contact-info-block">
          </div>
          <div class="links-grid-full">
            <!-- GitHub -->
            <a href="https://github.com/minislel" target="_blank" rel="noopener noreferrer" class="link-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              minislel
            </a>
            <!-- LinkedIn -->
            <a href="https://linkedin.com/in/minislel" target="_blank" rel="noopener noreferrer" class="link-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              minislel
            </a>
            <!-- Email -->
            <a href="mailto:marcin4kt@gmail.com" class="link-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              marcin4kt@gmail.com
            </a>
            <!-- Download CV -->
            <a href="/CV_Marcin_Swiderski.pdf" download="CV_Marcin_Swiderski.pdf" class="link-item cv-link-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              {{ t('Pobierz CV', 'Download CV') }}
            </a>
          </div>
        </div>
      </PortfolioCard>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PortfolioCard from './PortfolioCard.vue';
import avatar1 from '../assets/avatar_1.jpg';
import avatar2 from '../assets/avatar_2.jpg';
import avatar3 from '../assets/avatar_3.jpg';
import avatarEaster from '../assets/avatar_easter.gif';
import { useLocale } from '../utils/useLocale.js';

const { t } = useLocale();

const staticAvatars = [avatar1, avatar2, avatar3];
const currentAvatar = ref(avatar1);

onMounted(() => {
  // Check URL params first (e.g. ?easter=true or ?gif=true) or roll a 1/10000 chance
  const urlParams = new URLSearchParams(window.location.search);
  const forceEaster = urlParams.has('easter') || urlParams.has('gif');
  const roll = Math.floor(Math.random() * 10000);
  
  if (forceEaster || roll === 0) {
    currentAvatar.value = avatarEaster;
  } else {
    // Pick a random static avatar
    const randIndex = Math.floor(Math.random() * staticAvatars.length);
    currentAvatar.value = staticAvatars[randIndex];
  }
});

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    const yOffset = -90;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
</script>

<style scoped>
.text-left {
  text-align: left !important;
}

.mono {
  font-family: var(--font-mono);
}

.about-grid-row-2 {
  grid-template-columns: 1fr !important; /* Forces full width */
  width: 100%;
}

.contact-full-card {
  width: 100%;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 2.5rem;
  align-items: center;
}

.contact-info-block {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.status-badge-container {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(57, 255, 20, 0.08);
  border: 1px solid rgba(57, 255, 20, 0.25);
  padding: 0.4rem 1.1rem;
  border-radius: 100px;
  width: fit-content;
  position: relative;
}

.status-marker-dot {
  width: 7.5px;
  height: 7.5px;
  background: var(--accent-green);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent-green);
  z-index: 2;
}

.status-marker-pulse {
  position: absolute;
  left: 17.5px; /* center coordinates relative to padding */
  width: 15px;
  height: 15px;
  background: rgba(57, 255, 20, 0.35);
  border-radius: 50%;
  animation: statusPulse 2s infinite ease-out;
  z-index: 1;
}

.status-badge-text {
  font-size: 0.72rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.04em;
}

.links-grid-full {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;
}

.cv-link-item {
  background: rgba(0, 242, 254, 0.04) !important;
  border-color: rgba(0, 242, 254, 0.15) !important;
  color: var(--accent-cyan) !important;
}

.cv-link-item:hover {
  background: rgba(0, 242, 254, 0.08) !important;
  border-color: rgba(0, 242, 254, 0.35) !important;
  transform: translateY(-2px);
}

@keyframes statusPulse {
  0% { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(1.6); opacity: 0; }
}

@media (max-width: 820px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
  .status-badge-container {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .links-grid-full {
    grid-template-columns: 1fr;
  }
}
</style>
