import React, { useEffect, useState } from 'react';
import { Download, Search, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

const Crops = () => {
  const { t } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    filterCrops();
  }, [crops, searchTerm, statusFilter]);

  const fetchCrops = async () => {
    try {
      const response = await api.get('/admin/crops');
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCrops = () => {
    let filtered = crops;

    if (searchTerm) {
      filtered = filtered.filter(
        (crop) =>
          crop.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crop.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((crop) => crop.status === statusFilter);
    }

    setFilteredCrops(filtered);
  };

  const handleDelete = async (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await api.delete(`/admin/crops/${cropId}`);
        fetchCrops();
      } catch (error) {
        console.error('Error deleting crop:', error);
        alert('Failed to delete crop');
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/admin/export/crops/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'crops.csv');
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
        <div className="py-12 text-center text-slate-600 dark:text-slate-300">Loading crops...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div data-testid="crops-page">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{t('cropManagement')}</h1>
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
                <option value="available">{t('available')}</option>
                <option value="bidding">{t('bids')}</option>
                <option value="sold">{t('sold')}</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] table-auto divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-100/80 dark:bg-slate-950/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('crop')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('farmer')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('quantity')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('basePrice')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white/50 dark:divide-slate-800 dark:bg-slate-900/30">
                {filteredCrops.length > 0 ? (
                  filteredCrops.map((crop) => (
                    <tr key={crop.id} data-testid={`crop-row-${crop.id}`}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">{crop.cropName}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{crop.cropNameMarathi}</div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900 dark:text-slate-200">{crop.farmerName}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900 dark:text-slate-200">
                        {crop.quantity} {crop.unit}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                        Rs. {crop.basePrice.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                            crop.status === 'sold'
                              ? 'bg-green-100 text-green-800 dark:bg-emerald-950/50 dark:text-emerald-200'
                              : crop.status === 'bidding'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200'
                              : crop.status === 'available'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-amber-950/50 dark:text-amber-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-200'
                          }`}
                        >
                          {crop.status === 'available' ? t('available') : crop.status === 'sold' ? t('sold') : crop.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <button
                          onClick={() => handleDelete(crop.id)}
                          className="rounded-xl p-2 text-red-600 hover:bg-red-50 hover:text-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                          title="Delete Crop"
                          data-testid={`delete-button-${crop.id}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
                      {t('noCropsFound')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          {t('showing')} {filteredCrops.length} {t('of')} {crops.length} {t('crops').toLowerCase()}
        </div>
      </div>
    </Layout>
  );
};

export default Crops;
