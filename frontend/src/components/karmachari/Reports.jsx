import React from 'react';
import { useTranslation } from 'react-i18next';
import KarmachariDashboard from './KarmachariDashboard';

const Reports = () => {
  const { t } = useTranslation();
  
  // Reusing the dashboard component as it already shows comprehensive reports
  return <KarmachariDashboard />;
};

export default Reports;