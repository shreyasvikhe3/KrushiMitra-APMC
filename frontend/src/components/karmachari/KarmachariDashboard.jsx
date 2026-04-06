import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import api from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';

const KarmachariDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    users: {},
    crops: {},
    transactions: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/karmachari/reports');
        setStats({
          users: response.data?.users || {},
          crops: response.data?.crops || {},
          transactions: response.data?.transactions || {}
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          users: {},
          crops: {},
          transactions: {}
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl" data-testid="karmachari-dashboard">
        {t('karmachari.dashboard')}
      </h1>

      <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white shadow-lg sm:p-6">
        <p className="text-sm text-amber-50">
          Use the sidebar to manage users, inspect transactions, review reports, and update market prices.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        <StatCard title={t('karmachari.statistics.totalUsers')} value={stats.users.total} />
        <StatCard title={t('karmachari.statistics.totalFarmers')} value={stats.users.farmers} />
        <StatCard title={t('karmachari.statistics.totalTraders')} value={stats.users.traders} />
        <StatCard title={t('karmachari.statistics.pendingApprovals')} value={stats.users.pendingApprovals} color="text-yellow-600" />
        <StatCard title={t('karmachari.statistics.totalCrops')} value={stats.crops.total} />
        <StatCard title={t('karmachari.statistics.availableCrops')} value={stats.crops.available} color="text-green-600" />
        <StatCard title={t('karmachari.statistics.totalTransactions')} value={stats.transactions.total} />
        <StatCard
          title={t('karmachari.statistics.totalValue')}
          value={`Rs. ${stats.transactions.totalValue?.toLocaleString() || 0}`}
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color = '' }) => (
  <Card className="border-slate-200">
    <CardHeader>
      <CardTitle className="text-sm">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className={`break-words text-3xl font-bold ${color}`}>{value || 0}</p>
    </CardContent>
  </Card>
);

export default KarmachariDashboard;
