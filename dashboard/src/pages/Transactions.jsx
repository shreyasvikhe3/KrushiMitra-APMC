import React, { useEffect, useState } from 'react';
import { Download, Search } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

const Transactions = () => {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/admin/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(
        (txn) =>
          txn.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.traderName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const downloadBlob = (data, filename) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/admin/export/transactions/csv', { responseType: 'blob' });
      downloadBlob(response.data, 'transactions.csv');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV');
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await api.get('/admin/export/transactions/pdf', { responseType: 'blob' });
      downloadBlob(response.data, 'transactions.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
    }
  };

  const totalValue = filteredTransactions.reduce((sum, txn) => sum + txn.totalAmount, 0);

  if (loading) {
    return (
      <Layout>
        <div className="py-12 text-center text-slate-600 dark:text-slate-300">Loading transactions...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div data-testid="transactions-page">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{t('transactions')}</h1>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleExportCSV}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-white transition-colors hover:bg-emerald-700 sm:w-auto"
              data-testid="export-csv-button"
            >
              <Download size={18} />
              {t('exportCsv')}
            </button>
            <button
              onClick={handleExportPDF}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-2.5 text-white transition-colors hover:bg-rose-600 sm:w-auto"
              data-testid="export-pdf-button"
            >
              <Download size={18} />
              {t('exportPdf')}
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-[28px] bg-gradient-to-r from-emerald-500 to-emerald-700 p-5 text-white shadow-[0_22px_55px_rgba(22,163,74,0.28)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm opacity-90">{t('totalTransactionValue')}</p>
              <p className="mt-1 break-words text-3xl font-bold sm:text-4xl">
                Rs. {totalValue.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">{t('totalTransactions')}</p>
              <p className="mt-1 text-4xl font-bold">{filteredTransactions.length}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search')}
              className="w-full rounded-2xl border border-slate-200 bg-white/90 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white"
              data-testid="search-input"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] table-auto divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-100/80 dark:bg-slate-950/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('transactionId')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('crop')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('farmer')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('trader')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('quantity')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('amount')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white/50 dark:divide-slate-800 dark:bg-slate-900/30">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((txn) => (
                    <tr key={txn.id} data-testid={`transaction-row-${txn.id}`}>
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-slate-500 dark:text-slate-400">
                        {txn.id.substring(0, 12)}...
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{txn.cropName}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900 dark:text-slate-200">{txn.farmerName}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900 dark:text-slate-200">{txn.traderName}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900 dark:text-slate-200">
                        {txn.quantity} {txn.unit}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-green-600 dark:text-emerald-300">
                        Rs. {txn.totalAmount.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(txn.transactionDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
                      {t('noTransactionsFound')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          {t('showing')} {filteredTransactions.length} {t('of')} {transactions.length} {t('transactions').toLowerCase()}
        </div>
      </div>
    </Layout>
  );
};

export default Transactions;
