import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { Button } from '../ui/button';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'shetkari':
        return '/shetkari/dashboard';
      case 'vyapari':
        return '/vyapari/dashboard';
      case 'karmachari':
        return '/karmachari/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/50 bg-white/80 text-slate-900 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/75 dark:text-slate-100 dark:shadow-[0_12px_45px_rgba(2,6,23,0.45)] reveal-up">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[4.5rem] flex-col justify-center gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-0">
          <Link to={getDashboardLink()} className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 float-soft">
              KM
            </div>
            <div className="min-w-0">
              <span className="block truncate font-display text-xl font-bold text-slate-900 dark:text-white">{t('app.title')}</span>
              <span className="block truncate text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">APMC Nandgaon</span>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <LanguageToggle />
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100">
                  <span className="font-medium">{t('common.welcome')}, </span>
                  <span>{user?.fullName}</span>
                </div>
                <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-emerald-200">
                  {t(`roles.${user?.role}`)}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="rounded-xl border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 btn-sheen"
                  size="sm"
                >
                  {t('common.logout')}
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="rounded-xl border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 btn-sheen"
                  size="sm"
                >
                  {t('auth.login')}
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="rounded-xl bg-emerald-700 text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-800 btn-sheen"
                  size="sm"
                >
                  {t('auth.register')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
