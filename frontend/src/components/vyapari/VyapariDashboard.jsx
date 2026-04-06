import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const VyapariDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl" data-testid="vyapari-dashboard">
        {t('vyapari.dashboard')}
      </h1>

      {!user?.isApproved && (
        <div className="mb-6 rounded-r-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <p className="text-yellow-700">{t('messages.accountPendingApproval')}</p>
        </div>
      )}

      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-5 text-white shadow-lg sm:p-6">
        <p className="text-sm text-blue-50">
          Use the sidebar to browse crops, place bids, review your offers, and check purchase history.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        <StatCard title={t('vyapari.myBids')} value={0} />
        <StatCard title={t('vyapari.bidStatus.accepted')} value={0} />
        <StatCard title={t('vyapari.purchases')} value={0} />
        <StatCard title={t('shetkari.totalAmount')} value="Rs. 0" />
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

export default VyapariDashboard;
