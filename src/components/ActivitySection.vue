<template>
  <section id="activity-extras" class="section">
    <div class="section-header">
      <span class="section-subtitle">05 / {{ t('Dodatki', 'Extras') }}</span>
      <h2 class="section-title">{{ t('Aktywność & Dodatki', 'Activity & Extras') }}</h2>
    </div>
    
    <div class="bento-grid">
      <!-- Card 1: Hardware & Field Support (col-span-2) -->
      <PortfolioCard class="bento-card hardware-card" accent="green">
        <!-- Blueprint Corner Decors -->
        <div class="decor-corner top-left">+</div>
        <div class="decor-corner bottom-right">└─ ─</div>
        <div class="top-glow-bar green-glow"></div>

        <!-- Huge Faded Watermark Icon -->
        <div class="bento-watermark watermark-green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
        </div>

        <div class="bento-card-inner">
          <div class="bento-header">
            <div class="bento-icon-box box-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bento-icon"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
            </div>
            <div class="bento-title-group">
              <h3 class="bento-card-title">Hardware & IT Family Support</h3>
            </div>
          </div>
          
          <p class="bento-tagline">{{ t('Praktyczny Helpdesk, Diagnostyka i Rozwiązywanie problemów', 'Practical Helpdesk, Diagnostics & Problem Solving') }}</p>
          
          <div class="bento-details">
            <!-- Double Glass Inner Tiles -->
            <div class="detail-sub-tile">
              <span class="detail-label">{{ t('Zakres działań', 'Scope of activities') }}</span>
              <p class="detail-text">{{ t('Jestem tym ziomkiem w rodzinie, do którego wszyscy idą, jak tylko trzeba pomóc z elektroniką, telefonem, PC, internetem, niedziałającą drukarką czy konfiguracją kamer.', 'I\'m that go-to guy in the family everyone runs to when they need help with electronics, phones, PCs, internet, broken printers, or setting up security cameras.') }}</p>
            </div>
            <div class="detail-sub-tile highlighted-sub-tile green-glow-border">
              <span class="detail-label green-text">{{ t('Impact & Zysk', 'Impact & Outcome') }}</span>
              <p class="detail-text">{{ t('Umiejętność pracy z użytkownikiem końcowym, tłumaczenie skomplikowanych problemów na prosty język oraz bezstresowe rozwiązywanie awarii pod presją czasu.', 'Ability to work with end users, translating complex issues into simple language, and stress-free troubleshooting under time pressure.') }}</p>
            </div>
          </div>
        </div>
      </PortfolioCard>

      <!-- Card 3: Certyfikaty & Uczelnia (col-span-2) -->
      <PortfolioCard class="bento-card education-card" accent="blue">
        <!-- Blueprint Corner Decors -->
        <div class="decor-corner top-left">+</div>
        <div class="decor-corner bottom-right">└─ ─</div>
        <div class="top-glow-bar blue-glow"></div>

        <!-- Huge Faded Watermark Icon -->
        <div class="bento-watermark watermark-blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
        </div>

        <div class="bento-card-inner vertical-layout">
          <div class="bento-header">
            <div class="bento-icon-box box-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bento-icon"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            </div>
            <div class="bento-title-group">
              <span class="bento-tag tag-blue">{{ t('Akademickie Fundamenty', 'Academic Foundations') }}</span>
              <h3 class="bento-card-title">{{ t('Certyfikaty', 'Certificates') }}</h3>
            </div>
          </div>          
          <div class="bento-details vertical-details">
            <!-- Double Glass Certs Minimalist Tile -->
            <div class="detail-sub-tile highlighted-sub-tile blue-glow-border">
              <span class="detail-label blue-text">{{ t('Certyfikaty & Kwalifikacje', 'Certificates & Qualifications') }}</span>
              <div class="certs-minimal-list">
                <div class="cert-minimal-item" v-for="cert in certificates" :key="cert.credentialId">
                  <span class="cert-minimal-title">{{ cert.title }}</span>
                  <span class="cert-minimal-meta">{{ cert.issuer }} • {{ cert.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PortfolioCard>

      <!-- Card 2: Samorząd Studencki (row-span-2 / col-span-1) -->
      <PortfolioCard class="bento-card student-gov-card" accent="purple">
        <!-- Blueprint Corner Decors -->
        <div class="decor-corner top-left">+</div>
        <div class="decor-corner bottom-right">└─ ─</div>
        <div class="top-glow-bar purple-glow"></div>

        <!-- Huge Faded Watermark Icon -->
        <div class="bento-watermark watermark-purple">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>

        <div class="bento-card-inner vertical-layout">
          <div class="bento-header">
            <div class="bento-icon-box box-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bento-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div class="bento-title-group">
              <span class="bento-tag tag-purple">{{ t('Logistyka & Przywództwo', 'Logistics & Leadership') }}</span>
              <h3 class="bento-card-title">{{ t('Samorząd Studencki', 'Student Government') }}</h3>
            </div>
          </div>
          
          <p class="bento-tagline">{{ t('Działalność w Samorządzie Studenckim & Koordynacja Wydarzeń', 'Student Government Activity & Event Coordination') }}</p>
          
          <div class="bento-details vertical-details">
            <!-- Double Glass Inner Tiles -->
            <div class="detail-sub-tile">
              <span class="detail-label">{{ t('Zakres działań', 'Scope of activities') }}</span>
              <p class="detail-text">{{ t('Współorganizacja inicjatyw uczelnianych, takich jak hackathony, imprezy świąteczne, juwenaliowe. Zarządzanie zapleczem logistyczno-technicznym oraz koordynacja pracy zespołowej przy projektach studenckich.', 'Co-organizing university initiatives, such as hackathons, holiday parties, and graduation events. Managing logistical and technical resources, and coordinating teamwork on student projects.') }}</p>
            </div>
            <div class="detail-sub-tile highlighted-sub-tile purple-glow-border">
              <span class="detail-label purple-text">{{ t('Impact & Zysk', 'Impact & Outcome') }}</span>
              <p class="detail-text">{{ t('Praktyczna szkoła umiejętności miękkich: sprawna komunikacja, negocjacje, zarządzanie budżetem oraz dowożenie złożonych przedsięwzięć od pomysłu do finału.', 'Practical school of soft skills: effective communication, negotiations, budget management, and delivering complex projects from idea to final execution.') }}</p>
            </div>
          </div>
        </div>
      </PortfolioCard>

      <!-- Card 4: AI Web Deployments & Local SEO (col-span-1) -->
      <PortfolioCard class="bento-card web-crafting-card" accent="orange">
        <!-- Blueprint Corner Decors -->
        <div class="decor-corner top-left">+</div>
        <div class="decor-corner bottom-right">└─ ─</div>
        <div class="top-glow-bar orange-glow"></div>

        <!-- Huge Faded Watermark Icon -->
        <div class="bento-watermark watermark-orange">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        </div>

        <div class="bento-card-inner vertical-layout">
          <div class="bento-header">
            <div class="bento-icon-box box-orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bento-icon"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <div class="bento-title-group">
              <span class="bento-tag tag-orange">{{ t('Wdrożenia & SEO', 'Deployments & SEO') }}</span>
              <h3 class="bento-card-title">AI Web Deployments</h3>
            </div>
          </div>
          
          <p class="bento-tagline">{{ t('Szybkie witryny tworzone przy użyciu AI i z widocznością w Google', 'Fast websites built using AI and optimized for Google visibility') }}</p>
          
          <div class="bento-details vertical-details">
            <!-- Double Glass Inner Tiles -->
            <div class="detail-sub-tile">
              <span class="detail-label">{{ t('Zakres działań', 'Scope of activities') }}</span>
              <p class="detail-text">{{ t('Tworzenie i stawianie stron internetowych z użyciem AI, wdrożenia na Vercel, konfiguracja domen, optymalizacja SEO oraz zakładanie i optymalizacja wizytówek w Google Business Profile.', 'Building and deploying websites using AI, Vercel hosting, domain setup, SEO optimization, and creating/optimizing Google Business Profiles.') }}</p>
            </div>
            <div class="detail-sub-tile highlighted-sub-tile orange-glow-border">
              <span class="detail-label orange-text">{{ t('Impact & Zysk', 'Impact & Outcome') }}</span>
              <p class="detail-text">{{ t('Kompleksowa obecność małego biznesu w sieci w kilka dni - od zera, przez szybki hosting, po widoczność lokalną w Google Maps.', 'Complete online presence for small businesses in days - from scratch, through fast hosting, to local search visibility in Google Maps.') }}</p>
            </div>
          </div>
        </div>
      </PortfolioCard>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import PortfolioCard from './PortfolioCard.vue';
import { useLocale } from '../utils/useLocale.js';

const { t } = useLocale();

const certificates = computed(() => [
  {
    title: 'Building with the Claude API',
    issuer: 'Anthropic Education',
    date: t('Cze 2026', 'Jun 2026'),
    credentialId: 'anth-bca-2026'
  },
  {
    title: 'Introduction to Model Context Protocol',
    issuer: 'Anthropic Education',
    date: t('Cze 2026', 'Jun 2026'),
    credentialId: 'anth-mcp-2026'
  },
  {
    title: 'Claude Code in Action',
    issuer: 'Anthropic Education',
    date: t('Cze 2026', 'Jun 2026'),
    credentialId: 'anth-cca-2026'
  },
  {
    title: 'Introduction to Agent Skills',
    issuer: 'Anthropic Education',
    date: t('Maj 2026', 'May 2026'),
    credentialId: 'anth-ias-2026'
  },
  {
    title: 'ITS JavaScript',
    issuer: 'Certiport',
    date: t('Gru 2024', 'Dec 2024'),
    credentialId: '5pmB-4wbN'
  },
  {
    title: 'ITS Network Security',
    issuer: 'Certiport',
    date: t('Gru 2024', 'Dec 2024'),
    credentialId: 'wbVWK-FaG4'
  },
  {
    title: 'ITS Computational Thinking',
    issuer: 'Certiport',
    date: t('Gru 2024', 'Dec 2024'),
    credentialId: '82bR-uSr3'
  },
  {
    title: 'AZ-900 Microsoft Azure Fundamentals',
    issuer: 'Microsoft',
    date: t('Maj 2024', 'May 2024'),
    credentialId: 'DpeP-4TVd'
  },
  {
    title: 'ITS Software Development',
    issuer: 'Certiport',
    date: t('Sty 2024', 'Jan 2024'),
    credentialId: 'wUmzb-H9sM'
  },
  {
    title: 'ITS Networking',
    issuer: 'Certiport',
    date: t('Maj 2024', 'May 2024'),
    credentialId: 'xbWk-s4Ah'
  },
  {
    title: 'ITS Databases',
    issuer: 'Certiport',
    date: t('Lut 2024', 'Feb 2024'),
    credentialId: 'wwpkV-2FvB'
  }
]);
</script>

<style scoped>
/* Bento Grid Layout */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.75rem;
  width: 100%;
}

.bento-card {
  height: 100%;
  position: relative;
  background: rgba(10, 12, 20, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  
  /* Alternative Tech Grid Pattern (Blueprint Matrix) */
  background-image: 
    radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Card spans for Bento Grid */
.hardware-card {
  grid-column: span 2;
}

.education-card {
  grid-column: span 1;
  grid-row: span 2;
}

.student-gov-card {
  grid-column: span 1;
}

.web-crafting-card {
  grid-column: span 1;
}

.bento-card-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-align: left;
  position: relative;
  z-index: 3;
}

.vertical-layout {
  justify-content: space-between;
  gap: 1.25rem;
}

/* Top Glow Neon Accent Bars */
.top-glow-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0.65;
  z-index: 4;
}

.green-glow { background: var(--accent-green); box-shadow: 0 2px 10px rgba(57, 255, 20, 0.5); }
.purple-glow { background: var(--accent-purple); box-shadow: 0 2px 10px rgba(191, 90, 242, 0.5); }
.blue-glow { background: var(--accent-blue); box-shadow: 0 2px 10px rgba(10, 132, 255, 0.5); }
.orange-glow { background: var(--accent-orange); box-shadow: 0 2px 10px rgba(255, 159, 10, 0.5); }

/* Blueprint corner details */
.decor-corner {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 0.55rem;
  color: var(--text-dim);
  opacity: 0.35;
  pointer-events: none;
  z-index: 2;
  user-select: none;
}

.top-left { top: 12px; left: 14px; font-weight: 700; }
.top-right { top: 12px; right: 14px; }
.bottom-left { bottom: 12px; left: 14px; }
.bottom-right { bottom: 12px; right: 14px; }

/* Giant watermark icons in background */
.bento-watermark {
  position: absolute;
  bottom: -25px;
  right: -25px;
  width: 160px;
  height: 160px;
  opacity: 0.02;
  pointer-events: none;
  z-index: 1;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease;
}

.watermark-green { color: var(--accent-green); }
.watermark-purple { color: var(--accent-purple); }
.watermark-blue { color: var(--accent-blue); }
.watermark-orange { color: var(--accent-orange); }

.bento-card:hover .bento-watermark {
  transform: scale(1.18) rotate(6deg);
  opacity: 0.045;
}

/* Header Styles */
.bento-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 0.6rem;
  margin-top: 0.4rem;
}

.bento-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bento-icon {
  width: 18px;
  height: 18px;
}

.box-green { color: var(--accent-green); border-color: rgba(57, 255, 20, 0.2); }
.box-purple { color: var(--accent-purple); border-color: rgba(191, 90, 242, 0.2); }
.box-blue { color: var(--accent-blue); border-color: rgba(10, 132, 255, 0.2); }
.box-orange { color: var(--accent-orange); border-color: rgba(255, 159, 10, 0.2); }

.bento-title-group {
  display: flex;
  flex-direction: column;
}

.bento-tag {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.tag-green { color: var(--accent-green); }
.tag-purple { color: var(--accent-purple); }
.tag-blue { color: var(--accent-blue); }
.tag-orange { color: var(--accent-orange); }

.bento-card-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
}

.bento-tagline {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1.1rem;
  line-height: 1.4;
  opacity: 0.95;
}

/* Double Glass Sub-Tiles */
.bento-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: auto;
}

.vertical-details {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: auto;
  flex-grow: 1;
}

.detail-sub-tile {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 1.1rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.detail-sub-tile:hover {
  background: rgba(255, 255, 255, 0.045);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}

.highlighted-sub-tile {
  background: rgba(255, 255, 255, 0.04);
}

.green-glow-border { border-color: rgba(57, 255, 20, 0.2); }
.purple-glow-border { border-color: rgba(191, 90, 242, 0.2); }
.blue-glow-border { border-color: rgba(10, 132, 255, 0.2); }
.orange-glow-border { border-color: rgba(255, 159, 10, 0.2); }

.detail-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.4rem;
}

.green-text { color: var(--accent-green); }
.purple-text { color: var(--accent-purple); }
.blue-text { color: var(--accent-blue); }
.orange-text { color: var(--accent-orange); }

.detail-text {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.5;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .bento-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .hardware-card,
  .student-gov-card,
  .education-card,
  .web-crafting-card {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }
  
  .bento-details {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .bento-card {
    padding: 1.5rem !important; /* Adapt grid padding inside container */
  }
  .bento-card-title {
    font-size: 1.1rem;
  }
  
  .bento-tagline {
    font-size: 0.85rem;
    margin-bottom: 0.85rem;
  }
  
  .detail-sub-tile {
    padding: 0.85rem;
  }
  
  .detail-text {
    font-size: 0.8rem;
  }
}

/* Minimalist certs list */
.certs-minimal-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: 0.5rem;
  flex-grow: 1;
  justify-content: space-between;
}

.cert-minimal-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
  padding: 0.3rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.cert-minimal-item:last-child {
  border-bottom: none;
}

.cert-minimal-title {
  font-size: 0.84rem;
  font-weight: 700;
  color: #ffffff;
  text-align: left;
}

.cert-minimal-meta {
  font-size: 0.72rem;
  color: var(--text-dim);
  text-align: left;
}

/* Custom stretch rules for education card */
.education-card .detail-sub-tile {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>
