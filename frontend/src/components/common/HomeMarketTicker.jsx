import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';

const HomeMarketTicker = () => {
  const { t, i18n } = useTranslation();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPrices = async () => {
      try {
        const response = await api.get('/market-prices');
        if (isMounted) {
          setPrices(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        if (isMounted) {
          setPrices([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrices();
    const intervalId = window.setInterval(fetchPrices, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const loopedPrices = useMemo(() => {
    if (!prices.length) return [];
    return [...prices, ...prices];
  }, [prices]);

  if (loading) {
    return (
      <div className="rounded-[28px] border border-emerald-100 bg-white/85 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:border-slate-800/70 dark:bg-slate-900/75 dark:shadow-[0_20px_55px_rgba(2,6,23,0.35)]">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{t('home.marketTicker.loading')}</p>
      </div>
    );
  }

  if (!prices.length) {
    return (
      <div className="rounded-[28px] border border-emerald-100 bg-white/85 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:border-slate-800/70 dark:bg-slate-900/75 dark:shadow-[0_20px_55px_rgba(2,6,23,0.35)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{t('home.marketTicker.title')}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('home.marketTicker.empty')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-emerald-100 bg-white/85 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/75 dark:shadow-[0_20px_55px_rgba(2,6,23,0.35)]">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
            {t('home.marketTicker.live')}
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-slate-900 dark:text-white">
            {t('home.marketTicker.title')}
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('home.marketTicker.subtitle')}</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-emerald-50 bg-[linear-gradient(180deg,rgba(236,253,245,0.9),rgba(255,255,255,0.96))] py-3 dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(6,78,59,0.24),rgba(15,23,42,0.92))]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white via-white/70 to-transparent dark:from-slate-900 dark:via-slate-900/70" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white via-white/70 to-transparent dark:from-slate-900 dark:via-slate-900/70" />

        <div className="home-market-marquee flex w-max gap-4 px-3">
          {loopedPrices.map((price, index) => (
            <div
              key={`${price.id}-${index}`}
              className="min-w-[220px] rounded-2xl border border-white bg-white/95 px-4 py-3 shadow-sm sm:min-w-[250px] dark:border-slate-800 dark:bg-slate-950/90"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {i18n.language === 'mr' ? price.cropNameMarathi : price.cropName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {t('home.marketTicker.avgPriceLabel')} Rs. {price.avgPrice} / {t(`units.${price.unit}`)}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200">
                  {t('home.marketTicker.updated')}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('karmachari.minPrice')}</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">Rs. {price.minPrice}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('karmachari.maxPrice')}</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">Rs. {price.maxPrice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeMarketTicker;
