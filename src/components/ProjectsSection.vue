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
        :funFact="project.funFact"
        :bullets="project.bullets"
        :image="project.image"
        :logoSvg="project.logoSvg"
        :logoImg="project.logoImg"
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
import tinderImg from '../assets/project_tinder_copilot.webp';
import dropflowImg from '../assets/project_dropflow.webp';
import homelabImg from '../assets/project_homelab.webp';
import dropflowIcon from '../assets/dropflow-icon.webp';
import tinderCopilotIcon from '../assets/tinder-copilot-icon.webp';

const { t } = useLocale();

const projects = computed(() => [
  {
    title: 'DropFlow',
    category: t('Platforma SaaS (WIP)', 'SaaS Platform (WIP)'),
    description: t(
      'Platforma automatyzująca proces dropshippingu między różnymi portalami e-commerce. Oferuje wystawianie ofert jednym kliknięciem, generowanie zoptymalizowanych tytułów i opisów SEO przez AI i automatyczną obsługę zamówień.',
      'A platform automating the dropshipping process between various e-commerce portals. It offers one-click offer listing, AI-driven generation of optimized SEO titles and descriptions, and automated order processing.'
    ),
    image: dropflowImg,
    logoImg: dropflowIcon,
    logoSvg: '',
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
      'Moje prywatne środowisko serwerowe oparte na TrueNAS SCALE, wykorzystywane jako lokalne centrum zarządzania usługami. Zapewnia konteneryzację usług w Dockerze, automatyczne kopie zapasowe danych oraz zdalny dostęp przez VPN.',
      'My private server environment based on TrueNAS SCALE, used as a local service management hub. Provides containerization of services in Docker, automated data backups and remote access via VPN.'
    ),
    image: homelabImg,
    logoSvg: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>',
    accent: 'green',
    year: t('Aktywny', 'Active'),
    statusType: 'active',
    github: '',
    live: '',
    funFact: t('💡 Ciekawostka: Ta strona portfolio jest hostowana właśnie na tym HomeLabie!', '💡 Fun fact: This portfolio website is hosted on this HomeLab infrastructure!'),
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
      'Eksperymentalny asystent AI (PoC) wspierający konwersacje randkowe w czasie rzeczywistym.',
      'Experimental AI assistant (PoC) supporting dating app conversations in real-time.'
    ),
    bullets: [
      {
        label: t('Kontekst czatu', 'Context-Aware'),
        text: t('Analiza profilu i całej historii czatu.', 'Full chat history and profile analysis.')
      },
      {
        label: t('Autouzupełnianie', 'Inline Autocomplete'),
        text: t('Podpowiedzi tekstu jak w GitHub Copilot.', 'Text suggestions in GitHub Copilot style.')
      },
      {
        label: t('Ocena wiadomości', 'Move Rating'),
        text: t('Ocena jakości wiadomości (brilliant, blunder, inaccuracy).', 'Message quality rating (brilliant, blunder, inaccuracy).')
      }
    ],
    image: tinderImg,
    logoImg: tinderCopilotIcon,
    logoSvg: '',
    accent: 'purple',
    year: 'MVP (PoC)',
    statusType: 'abandoned',
    github: 'https://github.com/minislel/TinderCopilotRewrite',
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
