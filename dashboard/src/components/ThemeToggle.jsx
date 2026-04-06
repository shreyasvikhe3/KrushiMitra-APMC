import React from 'react';
import { Moon, SunMedium } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-100 bg-white/90 text-slate-700 shadow-sm transition hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-100 dark:hover:bg-slate-800"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <SunMedium size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;
