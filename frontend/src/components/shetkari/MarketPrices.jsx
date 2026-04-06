import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const MarketPrices = () => {
  const { t, i18n } = useTranslation();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await api.get('/market-prices');
      setPrices(response.data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('shetkari.marketPrices')}</h1>

      {prices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">{t('messages.noData')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prices.map((price) => (
            <Card key={price.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {i18n.language === 'mr' ? price.cropNameMarathi : price.cropName}
                </CardTitle>
                <p className="text-xs text-gray-500">
                  {t('karmachari.lastUpdated')}: {new Date(price.lastUpdated).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('karmachari.minPrice')}:</span>
                    <span className="font-semibold">₹{price.minPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('karmachari.maxPrice')}:</span>
                    <span className="font-semibold">₹{price.maxPrice}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-semibold">{t('karmachari.avgPrice')}:</span>
                    <span className="font-bold text-green-600">₹{price.avgPrice}</span>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    per {t(`units.${price.unit}`)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketPrices;