import React, { useEffect, useState } from 'react';
import { Moon, SunMedium } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

const ThemeToggle = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(nextTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      className="rounded-xl border-slate-300 bg-white/90 text-slate-900 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800"
      size="sm"
    >
      {theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
      <span className="ml-2 hidden sm:inline">{theme === 'dark' ? t('theme.light') : t('theme.dark')}</span>
    </Button>
  );
};

export default ThemeToggle;
