import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Ensure HTML attributes are set on component mount and when language changes
  useEffect(() => {
    const currentLang = i18n.language;
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const currentLanguage = i18n.language;
  const isRTL = document.documentElement.dir === 'rtl';

  return (
    <div className="flex items-center gap-2">
      <div className="flex rounded-md shadow-sm">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 text-sm font-medium border 
            ${isRTL ? 'rounded-r-md' : 'rounded-l-md'} 
            ${
              currentLanguage === 'en'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
        >
          {t('language.english')}
        </button>

        <button
          onClick={() => changeLanguage('ar')}
          className={`px-3 py-1 text-sm font-medium border 
            ${isRTL ? 'rounded-l-md' : 'rounded-r-md'} 
            ${
              currentLanguage === 'ar'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
        >
          {t('language.arabic')}
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
