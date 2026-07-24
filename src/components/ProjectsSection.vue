<template>
  <section id="projekty" class="section">
    <div class="section-header">
      <span class="section-subtitle">{{ t('04 / Dzieła', '04 / Creations') }}</span>
      <h2 class="section-title">{{ t('Projekty', 'Projects') }}</h2>
    </div>
    
    <div class="grid-3">
      <ProjectCard 
        v-for="project in projects"
        :key="project.title"
        :title="project.title"
        :category="project.category"
        :description="project.description"
        :image="project.image"
        :logoSvg="project.logoSvg"
        :techList="project.techList"
        :year="project.year"
        :statusType="project.statusType"
        :github="project.github"
        :live="project.live"
        :accent="project.accent"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import ProjectCard from './ProjectCard.vue';
import { useLocale } from '../utils/useLocale.js';
import tinderImg from '../assets/project_tinder_copilot.jpg';
import dropflowImg from '../assets/project_dropflow.jpg';
import homelabImg from '../assets/project_homelab.jpg';

const { t } = useLocale();

const projects = computed(() => [
  {
    title: 'DropFlow',
    category: t('Platforma SaaS (WIP)', 'SaaS Platform (WIP)'),
    description: t(
      'Platforma SaaS automatyzująca proces dropshippingu między AliExpress a Allegro. Oferuje wystawianie ofert jednym kliknięciem (one-click-listing), asynchroniczne mapowanie wariantów oraz semantyczne generowanie zoptymalizowanych tytułów i opisów SEO przez AI, z rygorystycznym uwzględnieniem restrykcji formatowania docelowego portalu.',
      'SaaS platform automating dropshipping processes between AliExpress and Allegro. Offers one-click product listing, asynchronous variant mapping, and semantic generation of optimized titles and SEO descriptions by AI, complying strictly with target portal formatting restrictions.'
    ),
    image: dropflowImg,
    logoSvg: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.26-1.5 1.5-2.5h-2c-1 0-1.79-.5-2.5-1.5z"></path><path d="M12 15l-3-3m0 0l3-3m-3 3h12"></path><path d="M15 9l-3-3 3-3"></path>',
    accent: 'cyan',
    year: t('W budowie!', 'Work in progress!'),
    statusType: 'wip',
    github: '',
    live: '',
    techList: [
      'C# / .NET 10',
      t('Integracja LLM / Semantic Kernel', 'LLM Integration / Semantic Kernel'),
      'Flutter',
      'PostgreSQL',
      'Hangfire',
      'Clean Architecture',
      'Prompt Engineering'
    ]
  },
  {
    title: 'HomeLab / Infrastructure',
    category: t('Infrastruktura', 'Infrastructure'),
    description: t(
      'Prywatne środowisko serwerowe oparte na TrueNAS SCALE, wykorzystywane jako lokalny poligon doświadczalny i centrum zarządzania usługami. Zapewnia konteneryzację mikrousług w Dockerze, automatyczną lokalną i chmurową retencję danych, bezpieczny dostęp zdalny przez VPN oraz zaawansowaną konfigurację sieciową i sprzętową.',
      'Private server environment based on TrueNAS SCALE, used as a local testing ground and service management hub. Provides containerization of microservices in Docker, automated local and cloud data backups, secure remote access via VPN, and advanced network and hardware configuration.'
    ),
    image: homelabImg,
    logoSvg: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>',
    accent: 'green',
    year: t('Aktywny', 'Active'),
    statusType: 'active',
    github: '',
    live: '',
    techList: [
      'TrueNAS SCALE / Linux',
      'Docker',
      t('Tunel Cloudflare', 'Cloudflare tunnel'),
      t('Konfiguracja dysków & hardware\'u', 'Hardware & Storage Configuration'),
      'Tailscale'
    ]
  },
  {
    title: 'Tinder Copilot',
    category: t('Rozszerzenie Chrome', 'Chrome Extension'),
    description: t(
      'Eksperymentalny projekt typu MVP (Proof of Concept) – asystent AI wspierający konwersacje w aplikacjach randkowych w czasie rzeczywistym. Oferuje autouzupełnianie tekstu (inline autocomplete w stylu GitHub Copilot), generowanie sugestii odpowiedzi z uwzględnieniem kontekstu czatu i profili oraz dynamiczny system oceny jakości wiadomości wzorowany na analizie ruchów z Chess.com (brilliant, blunder, inaccuracy).',
      'Experimental MVP (Proof of Concept) project – an AI assistant supporting dating app conversations in real-time. Features text autocompletion (inline autocomplete in GitHub Copilot style), context-aware response suggestions based on chat profiles, and a dynamic message quality rating system inspired by Chess.com movement analysis (brilliant, blunder, inaccuracy).'
    ),
    image: tinderImg,
    logoSvg: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>',
    accent: 'purple',
    year: 'MVP (PoC)',
    statusType: 'abandoned',
    github: '',
    live: '',
    techList: [
      t('Integracja LLM', 'LLM Integration'),
      t('Rozszerzenie Chrome', 'Chrome Extension'),
      'TypeScript',
      'Prompt Engineering'
    ]
  }
]);
</script>
