import React from 'react';
import { User, Shield, Info } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Settings = () => {
  const { user, isSuperAdmin } = useAuth();
  const { t } = useLanguage();

  return (
    <Layout>
      <div data-testid="settings-page">
        <h1 className="mb-8 font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{t('settingsTitle')}</h1>

        <div className="mb-6 rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <User className="text-slate-600 dark:text-slate-300" size={24} />
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{t('accountInformation')}</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">{t('fullName')}</label>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{user?.fullName}</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">{t('username')}</label>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">@{user?.username}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">{t('email')}</label>
                <p className="break-words text-lg font-semibold text-slate-900 dark:text-white">{user?.email}</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">{t('phone')}</label>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{user?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <Shield className="text-slate-600 dark:text-slate-300" size={24} />
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{t('rolePermissions')}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">{t('currentRole')}</label>
              <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-lg font-semibold capitalize text-green-800 dark:bg-emerald-950/50 dark:text-emerald-200">
                {user?.role}
              </span>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">{t('permissions')}</label>
              <div className="space-y-2 rounded-2xl bg-gray-50 p-4 dark:bg-slate-950/50">
                <div className="flex items-center gap-2"><span className="text-green-600 dark:text-emerald-300">{t('yes')}</span><span className="text-slate-900 dark:text-slate-200">{t('manageUsers')}</span></div>
                <div className="flex items-center gap-2"><span className="text-green-600 dark:text-emerald-300">{t('yes')}</span><span className="text-slate-900 dark:text-slate-200">{t('manageCrops')}</span></div>
                <div className="flex items-center gap-2"><span className="text-green-600 dark:text-emerald-300">{t('yes')}</span><span className="text-slate-900 dark:text-slate-200">{t('manageBids')}</span></div>
                <div className="flex items-center gap-2"><span className="text-green-600 dark:text-emerald-300">{t('yes')}</span><span className="text-slate-900 dark:text-slate-200">{t('viewTransactions')}</span></div>
                <div className="flex items-center gap-2"><span className="text-green-600 dark:text-emerald-300">{t('yes')}</span><span className="text-slate-900 dark:text-slate-200">{t('manageMarketPrices')}</span></div>
                <div className="flex items-center gap-2"><span className="text-green-600 dark:text-emerald-300">{t('yes')}</span><span className="text-slate-900 dark:text-slate-200">{t('exportData')}</span></div>
                {isSuperAdmin && (
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 dark:text-emerald-300">{t('yes')}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{t('manageAdmins')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <Info className="text-slate-600 dark:text-slate-300" size={24} />
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{t('systemInformation')}</h2>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <span className="text-slate-600 dark:text-slate-400">{t('version')}:</span>
              <span className="font-semibold text-slate-900 dark:text-white">1.0.0</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <span className="text-slate-600 dark:text-slate-400">{t('environment')}:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{t('production')}</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <span className="text-slate-600 dark:text-slate-400">{t('lastLogin')}:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
