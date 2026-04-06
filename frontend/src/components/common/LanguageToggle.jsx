import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'mr' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      className="rounded-xl border-emerald-200 bg-white text-emerald-900 shadow-sm hover:bg-emerald-50 hover:text-emerald-950 dark:border-emerald-900/60 dark:bg-slate-900/80 dark:text-emerald-100 dark:hover:bg-emerald-950/50"
      size="sm"
    >
      {i18n.language === 'en' ? 'मराठी' : 'English'}
    </Button>
  );
};

export default LanguageToggle;
