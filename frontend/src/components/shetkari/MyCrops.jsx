import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const MyCrops = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await api.get('/shetkari/crops');
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      available: 'default',
      bidding: 'secondary',
      sold: 'destructive',
      cancelled: 'outline'
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {t(`shetkari.status.${status}`)}
      </Badge>
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('shetkari.myCrops')}</h1>
        <Button onClick={() => navigate('/shetkari/add-crop')}>
          {t('shetkari.addCrop')}
        </Button>
      </div>

      {crops.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">{t('shetkari.noCrops')}</p>
            <Button onClick={() => navigate('/shetkari/add-crop')} className="mt-4">
              {t('shetkari.addCrop')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <Card key={crop.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {i18n.language === 'mr' ? crop.cropNameMarathi : crop.cropName}
                  </CardTitle>
                  {getStatusBadge(crop.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('shetkari.quantity')}:</span>
                    <span className="font-semibold">
                      {crop.quantity} {t(`units.${crop.unit}`)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('shetkari.basePrice')}:</span>
                    <span className="font-semibold">₹{crop.basePrice}</span>
                  </div>
                  {crop.status === 'sold' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('shetkari.soldPrice')}:</span>
                        <span className="font-semibold text-green-600">₹{crop.soldPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('shetkari.totalAmount')}:</span>
                        <span className="font-semibold text-green-600">
                          ₹{(crop.soldPrice * crop.quantity).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                  {crop.description && (
                    <p className="text-gray-600 text-xs mt-2">{crop.description}</p>
                  )}
                </div>
                {crop.status === 'bidding' && (
                  <Button
                    className="w-full mt-4"
                    variant="outline"
                    onClick={() => navigate(`/shetkari/bids/${crop.id}`)}
                  >
                    {t('shetkari.viewBids')}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCrops;