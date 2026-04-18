import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'shetkari':
        return '/shetkari/dashboard';
      case 'vyapari':
        return '/vyapari/dashboard';
      case 'karmachari':
        return '/karmachari/dashboard';
      default:
        return '/login';
    }
  };

  const quickLinks = [
    { label: t('footer.home'), to: '/' },
    { label: isAuthenticated ? t('footer.dashboard') : t('auth.login'), to: isAuthenticated ? getDashboardLink() : '/login' },
    { label: t('footer.register'), to: '/register' },
    { label: t('footer.forgotPassword'), to: '/forgot-password' }
  ];

  return (
    <footer className="mt-auto border-t border-emerald-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(237,247,239,0.96))] text-slate-700 backdrop-blur dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.84),rgba(15,23,42,0.96))] dark:text-slate-300 reveal-up">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="surface-lift rounded-2xl p-2">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{t('app.title')}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t('app.subtitle')}</p>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{t('footer.description')}</p>
          </div>

          <div className="surface-lift rounded-2xl p-2">
            <h4 className="mb-2 font-semibold text-slate-900 dark:text-white">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link className="transition hover:text-emerald-700 dark:hover:text-emerald-300" to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-lift rounded-2xl p-2">
            <h4 className="mb-2 font-semibold text-slate-900 dark:text-white">{t('footer.contactInfo')}</h4>
            <div className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              <p>APMC Nandgaon</p>
              <p>Maharashtra, India</p>
              <p>
                Phone:{' '}
                <a className="transition hover:text-emerald-700 dark:hover:text-emerald-300" href="tel:+911234567890">
                  +91 1234567890
                </a>
              </p>
              <p>
                Email:{' '}
                <a className="transition hover:text-emerald-700 dark:hover:text-emerald-300" href="mailto:info@krushimitra.com">
                  info@krushimitra.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-emerald-100 pt-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <p>&copy; {currentYear} {t('app.title')}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
