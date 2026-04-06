import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const MyBids = () => {
  const { t, i18n } = useTranslation();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const response = await api.get('/vyapari/bids');
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('vyapari.myBids')}</h1>

      {bids.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">{t('vyapari.myBidsEmpty')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <Card key={bid.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {bid.crop && (
                        i18n.language === 'mr' ? bid.crop.cropNameMarathi : bid.crop.cropName
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('vyapari.farmer')}: {bid.crop?.farmerName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(bid.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      bid.status === 'accepted'
                        ? 'default'
                        : bid.status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {t(`vyapari.bidStatus.${bid.status}`)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('shetkari.quantity')}</p>
                    <p className="font-semibold">
                      {bid.crop?.quantity} {t(`units.${bid.crop?.unit}`)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('shetkari.bidAmount')}</p>
                    <p className="font-semibold text-green-600">₹{bid.bidAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('shetkari.totalAmount')}</p>
                    <p className="font-semibold text-green-700">
                      ₹{(bid.bidAmount * (bid.crop?.quantity || 0)).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('common.status')}</p>
                    <p className="font-semibold">{t(`vyapari.bidStatus.${bid.status}`)}</p>
                  </div>
                </div>
                {bid.message && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-700">{bid.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBids;