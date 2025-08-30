import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguageInitialization = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Function to update HTML attributes
    const updateHtmlAttributes = (language) => {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    };

    // Set initial attributes
    updateHtmlAttributes(i18n.language);

    // Listen for language changes
    const handleLanguageChanged = (language) => {
      updateHtmlAttributes(language);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    // Cleanup
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  // Also run immediately on mount to ensure attributes are set
  useEffect(() => {
    const currentLang = i18n.language || localStorage.getItem('i18nextLng') || 'en';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]); // Include i18n.language in dependencies
};
