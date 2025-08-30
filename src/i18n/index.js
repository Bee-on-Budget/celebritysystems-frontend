import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

const resources = {
  en: {
    translation: enTranslations
  },
  ar: {
    translation: arTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

// Function to update HTML attributes based on language
const updateHtmlAttributes = (language) => {
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
};

// Listen for language changes and update HTML attributes
i18n.on('languageChanged', (language) => {
  updateHtmlAttributes(language);
});

// Initialize HTML attributes on first load
i18n.on('initialized', () => {
  updateHtmlAttributes(i18n.language);
});

// Also set attributes immediately if i18n is already initialized
if (i18n.isInitialized) {
  updateHtmlAttributes(i18n.language);
}

// Set initial attributes from localStorage if available (before i18n is ready)
const savedLanguage = localStorage.getItem('i18nextLng');
if (savedLanguage) {
  updateHtmlAttributes(savedLanguage);
}

export default i18n;


