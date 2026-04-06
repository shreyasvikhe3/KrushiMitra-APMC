import React, { useEffect, useState } from 'react';
import { Download, Edit, Trash2, Plus } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

const initialFormData = {
  cropName: '',
  cropNameMarathi: '',
  minPrice: '',
  maxPrice: '',
  avgPrice: '',
  unit: 'quintal'
};

const MarketPrices = () => {
  const { t } = useLanguage();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await api.get('/admin/market-prices');
      setPrices(response.data);
    } catch (error) {
      console.error('Error fetching market prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (price) => {
    setEditingPrice(price);
    setFormData({
      cropName: price.cropName,
      cropNameMarathi: price.cropNameMarathi,
      minPrice: price.minPrice,
      maxPrice: price.maxPrice,
      avgPrice: price.avgPrice,
      unit: price.unit || 'quintal'
    });
    setShowModal(true);
  };

  const handleDelete = async (priceId) => {
    if (window.confirm('Are you sure you want to delete this market price?')) {
      try {
        await api.delete(`/admin/market-prices/${priceId}`);
        fetchPrices();
      } catch (error) {
        console.error('Error deleting market price:', error);
        alert('Failed to delete market price');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPrice) {
        await api.put(`/admin/market-prices/${editingPrice._id}`, formData);
      } else {
        await api.post('/karmachari/market-prices', formData);
      }
      setShowModal(false);
      setEditingPrice(null);
      setFormData(initialFormData);
      fetchPrices();
    } catch (error) {
      console.error('Error saving market price:', error);
      alert('Failed to save market price');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/admin/export/market-prices/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'market-prices.csv');
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
        <div className="py-12 text-center">Loading market prices...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div data-testid="market-prices-page">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{t('marketPrices')}</h1>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => {
                setEditingPrice(null);
                setFormData(initialFormData);
                setShowModal(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-white transition-colors hover:bg-sky-600 sm:w-auto"
              data-testid="add-price-button"
            >
              <Plus size={18} />
              {t('addPrice')}
            </button>
            <button
              onClick={handleExportCSV}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-white transition-colors hover:bg-emerald-700 sm:w-auto"
              data-testid="export-csv-button"
            >
              <Download size={18} />
              {t('exportCsv')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">
          {prices.length > 0 ? (
            prices.map((price) => (
              <div key={price._id} className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/75" data-testid={`price-card-${price._id}`}>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{price.cropName}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{price.cropNameMarathi}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(price)}
                      className="rounded-xl p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-900 dark:text-blue-300 dark:hover:bg-blue-950/40"
                      title="Edit"
                      data-testid={`edit-button-${price._id}`}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(price._id)}
                      className="rounded-xl p-2 text-red-600 hover:bg-red-50 hover:text-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                      title="Delete"
                      data-testid={`delete-button-${price._id}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{t('minPrice')}:</span>
                    <span className="text-right font-semibold text-slate-900 dark:text-white">Rs. {price.minPrice}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{t('maxPrice')}:</span>
                    <span className="text-right font-semibold text-slate-900 dark:text-white">Rs. {price.maxPrice}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{t('avgPrice')}:</span>
                    <span className="text-right font-bold text-green-600">Rs. {price.avgPrice}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{t('unit')}:</span>
                    <span className="font-semibold capitalize text-slate-900 dark:text-white">{price.unit}</span>
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('lastUpdated')}: {new Date(price.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 sm:col-span-2 xl:col-span-3">
              {t('noMarketPricesAvailable')}
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[28px] border border-white/70 bg-white/92 p-6 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/92 sm:p-8">
              <h2 className="mb-6 font-display text-2xl font-bold text-slate-900 dark:text-white">
                {editingPrice ? t('editMarketPrice') : t('addMarketPrice')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('cropNameEnglish')}</label>
                  <input
                    type="text"
                    value={formData.cropName}
                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('cropNameMarathi')}</label>
                  <input
                    type="text"
                    value={formData.cropNameMarathi}
                    onChange={(e) => setFormData({ ...formData, cropNameMarathi: e.target.value })}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('minPrice')}</label>
                    <input
                      type="number"
                      value={formData.minPrice}
                      onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('maxPrice')}</label>
                    <input
                      type="number"
                      value={formData.maxPrice}
                      onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('avgPrice')}</label>
                    <input
                      type="number"
                      value={formData.avgPrice}
                      onChange={(e) => setFormData({ ...formData, avgPrice: e.target.value })}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('unit')}</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white"
                  >
                    <option value="kg">Kg</option>
                    <option value="quintal">Quintal</option>
                    <option value="ton">Ton</option>
                  </select>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-emerald-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-700"
                    data-testid="modal-save-button"
                  >
                    {t('save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-2xl bg-slate-200 px-4 py-2.5 font-semibold text-slate-800 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    data-testid="modal-cancel-button"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MarketPrices;
