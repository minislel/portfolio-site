import { ref, computed } from 'vue';

// Read initial value from localStorage or default to 'pl'
const currentLocale = ref(localStorage.getItem('portfolio-locale') || 'pl');

export function useLocale() {
  function setLocale(lang) {
    currentLocale.value = lang;
    localStorage.setItem('portfolio-locale', lang);
  }
  
  function toggleLocale() {
    setLocale(currentLocale.value === 'pl' ? 'en' : 'pl');
  }

  // Reactive state
  const locale = computed(() => currentLocale.value);

  // Translation helper function
  function t(plText, enText) {
    return currentLocale.value === 'pl' ? plText : enText;
  }

  return {
    locale,
    setLocale,
    toggleLocale,
    t
  };
}
