import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import api from '../../utils/api';

const ShetkariDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myCrops: 0,
    bids: 0,
    sold: 0,
    totalAmount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/shetkari/stats');
        setStats({
          myCrops: res.data.myCrops,
          bids: res.data.bids,
          sold: res.data.sold,
          totalAmount: res.data.totalAmount
        });
      } catch (error) {
        console.log('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl" data-testid="shetkari-dashboard">
        {t('shetkari.dashboard')}
      </h1>

      {!user?.isApproved && (
        <div className="mb-6 rounded-r-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <p className="text-yellow-700">{t('messages.accountPendingApproval')}</p>
        </div>
      )}

      <div className="mb-6 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 p-5 text-white shadow-lg sm:p-6">
        <p className="text-sm text-green-50">
          Use the sidebar to add crops, review your listings, check prices, and track transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        <StatCard title={t('shetkari.myCrops')} value={stats.myCrops || 0} />
        <StatCard title={t('shetkari.viewBids')} value={stats.bids || 0} />
        <StatCard title={t('shetkari.status.sold')} value={stats.sold || 0} />
        <StatCard title={t('shetkari.totalAmount')} value={`Rs. ${stats.totalAmount || 0}`} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <Card className="border-slate-200">
    <CardHeader>
      <CardTitle className="text-sm">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="break-words text-3xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default ShetkariDashboard;
