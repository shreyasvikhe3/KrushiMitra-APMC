import React, { useEffect, useState } from 'react';
import { Download, Search } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

const Bids = () => {
  const { t } = useLanguage();
  const [bids, setBids] = useState([]);
  const [filteredBids, setFilteredBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBids();
  }, []);

  useEffect(() => {
    filterBids();
  }, [bids, searchTerm, statusFilter]);

  const fetchBids = async () => {
    try {
      const response = await api.get('/admin/bids');
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBids = () => {
    let filtered = bids;

    if (searchTerm) {
      filtered = filtered.filter(
        (bid) =>
          bid.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bid.traderName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((bid) => bid.status === statusFilter);
    }

    setFilteredBids(filtered);
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/admin/export/bids/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bids.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-12 text-center text-slate-600 dark:text-slate-300">Loading bids...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div data-testid="bids-page">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{t('bidManagement')}</h1>
          <button
            onClick={handleExportCSV}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-white transition-colors hover:bg-emerald-700 sm:w-auto"
            data-testid="export-csv-button"
          >
            <Download size={18} />
            {t('exportCsv')}
          </button>
        </div>

        <div className="mb-6 rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('search')}</label>
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
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('status')}</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white"
                data-testid="status-filter"
              >
                <option value="all">{t('allStatus')}</option>
                <option value="pending">{t('pending')}</option>
                <option value="accepted">{t('accepted')}</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] table-auto divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-100/80 dark:bg-slate-950/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('crop')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('trader')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('bidAmount')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white/50 dark:divide-slate-800 dark:bg-slate-900/30">
                {filteredBids.length > 0 ? (
                  filteredBids.map((bid) => (
                    <tr key={bid.id} data-testid={`bid-row-${bid.id}`}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{bid.cropName || 'N/A'}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900 dark:text-slate-200">{bid.traderName || 'N/A'}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-green-600 dark:text-emerald-300">
                        Rs. {bid.bidAmount?.toLocaleString() || '0'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                            bid.status === 'accepted'
                              ? 'bg-green-100 text-green-800 dark:bg-emerald-950/50 dark:text-emerald-200'
                              : bid.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-amber-950/50 dark:text-amber-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-200'
                          }`}
                        >
                          {bid.status === 'pending' ? t('pending') : bid.status === 'accepted' ? t('accepted') : bid.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(bid.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
                      {t('noBidsFound')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          {t('showing')} {filteredBids.length} {t('of')} {bids.length} {t('bids').toLowerCase()}
        </div>
      </div>
    </Layout>
  );
};

export default Bids;
