import React, { useEffect, useState } from 'react';
import { Users, Wheat, Gavel, Receipt, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/dashboard-stats');
      setStats(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-12 text-center text-slate-600 dark:text-slate-300">Loading dashboard...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      </Layout>
    );
  }

  const statCards = [
    {
      titleKey: 'totalUsers',
      value: stats?.stats?.users?.total || 0,
      icon: Users,
      color: 'from-sky-500 to-blue-600',
      subStats: [
        { label: t('farmers'), value: stats?.stats?.users?.farmers || 0 },
        { label: t('traders'), value: stats?.stats?.users?.traders || 0 },
        { label: t('officers'), value: stats?.stats?.users?.officers || 0 }
      ]
    },
    {
      titleKey: 'pendingApprovals',
      value: stats?.stats?.users?.pendingApprovals || 0,
      icon: AlertCircle,
      color: 'from-amber-500 to-orange-600'
    },
    {
      titleKey: 'totalCrops',
      value: stats?.stats?.crops?.total || 0,
      icon: Wheat,
      color: 'from-emerald-500 to-green-600',
      subStats: [
        { label: t('available'), value: stats?.stats?.crops?.available || 0 },
        { label: t('sold'), value: stats?.stats?.crops?.sold || 0 }
      ]
    },
    {
      titleKey: 'totalBids',
      value: stats?.stats?.bids?.total || 0,
      icon: Gavel,
      color: 'from-violet-500 to-fuchsia-600',
      subStats: [
        { label: t('pending'), value: stats?.stats?.bids?.pending || 0 },
        { label: t('accepted'), value: stats?.stats?.bids?.accepted || 0 }
      ]
    },
    {
      titleKey: 'totalTransactions',
      value: stats?.stats?.transactions?.total || 0,
      icon: Receipt,
      color: 'from-indigo-500 to-cyan-600',
      subStats: [
        { label: t('totalValue'), value: `Rs. ${(stats?.stats?.transactions?.totalValue || 0).toLocaleString()}` }
      ]
    }
  ];

  return (
    <Layout>
      <div data-testid="admin-dashboard">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">Overview</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">{t('dashboardOverview')}</h1>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
            {t('adminSubtitle')}
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">
          {statCards.map((card) => (
            <div
              key={card.titleKey}
              className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-[0_20px_50px_rgba(2,6,23,0.35)] sm:p-6"
              data-testid={`stat-card-${card.titleKey}`}
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className={`rounded-2xl bg-gradient-to-br ${card.color} p-3 text-white shadow-lg`}>
                  <card.icon size={24} />
                </div>
                <div className="min-w-0 text-right">
                  <p className="break-words text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">{card.value}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t(card.titleKey)}</p>
                </div>
              </div>

              {card.subStats && (
                <div className="space-y-1 border-t border-slate-200 pt-3 dark:border-slate-800">
                  {card.subStats.map((subStat) => (
                    <div key={subStat.label} className="flex items-start justify-between gap-3 text-sm">
                      <span className="text-slate-600 dark:text-slate-400">{subStat.label}:</span>
                      <span className="text-right font-semibold text-slate-900 dark:text-white">{subStat.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 sm:p-6">
            <h2 className="mb-4 font-display text-2xl font-bold text-slate-900 dark:text-white">{t('recentUsers')}</h2>
            <div className="space-y-3">
              {stats?.recentActivities?.recentUsers?.length > 0 ? (
                stats.recentActivities.recentUsers.map((user) => (
                  <div key={user.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white">{user.fullName}</p>
                      <p className="text-sm capitalize text-slate-600 dark:text-slate-400">{user.role}</p>
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${user.isApproved ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200'}`}>
                      {user.isApproved ? t('approved') : t('pending')}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400">{t('noRecentUsers')}</p>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 sm:p-6">
            <h2 className="mb-4 font-display text-2xl font-bold text-slate-900 dark:text-white">{t('recentTransactions')}</h2>
            <div className="space-y-3">
              {stats?.recentActivities?.recentTransactions?.length > 0 ? (
                stats.recentActivities.recentTransactions.map((txn) => (
                  <div key={txn.id} className="rounded-2xl border border-slate-100 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white">{txn.cropName}</p>
                        <p className="break-words text-sm text-slate-600 dark:text-slate-400">{txn.farmerName} {t('to')} {txn.traderName}</p>
                      </div>
                      <p className="font-bold text-emerald-600 dark:text-emerald-300">Rs. {txn.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400">{t('noRecentTransactions')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
