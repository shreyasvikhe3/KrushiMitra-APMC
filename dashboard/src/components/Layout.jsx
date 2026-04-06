import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_22%),linear-gradient(180deg,_#f7fbf8_0%,_#f8fafc_50%,_#eef6f2_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_22%),linear-gradient(180deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-950/55 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 px-4 py-4 shadow-[0_10px_35px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:px-6 lg:px-8 dark:border-slate-800/80 dark:bg-slate-950/75 dark:shadow-[0_12px_45px_rgba(2,6,23,0.35)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-slate-700 shadow-sm lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900 sm:text-xl dark:text-white">{t('adminPanel')}</h2>
                <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">{t('adminSubtitle')}</p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex rounded-2xl border border-emerald-100 bg-white/85 p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`rounded-xl px-2 py-1 text-xs font-medium sm:px-3 ${
                    language === 'en'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('mr')}
                  className={`rounded-xl px-2 py-1 text-xs font-medium sm:px-3 ${
                    language === 'mr'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  मराठी
                </button>
              </div>
              <ThemeToggle />
              <div className="hidden text-right sm:block">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{user?.fullName}</p>
                <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{user?.role}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 font-bold text-white shadow-lg shadow-emerald-700/20">
                {user?.fullName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-81px)] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
