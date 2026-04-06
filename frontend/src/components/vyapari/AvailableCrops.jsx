import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const AvailableCrops = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await api.get('/vyapari/crops');
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('vyapari.availableCrops')}</h1>

      {crops.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">{t('vyapari.noCropsAvailable')}</p>
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
                  <Badge variant="secondary">{t(`shetkari.status.${crop.status}`)}</Badge>
                </div>
                <p className="text-sm text-gray-500">{t('vyapari.farmer')}: {crop.farmerName}</p>
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
                    <span className="font-semibold text-green-600">₹{crop.basePrice}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600 font-semibold">{t('shetkari.totalAmount')}:</span>
                    <span className="font-bold text-green-700">
                      ₹{(crop.basePrice * crop.quantity).toLocaleString()}
                    </span>
                  </div>
                  {crop.description && (
                    <p className="text-gray-600 text-xs mt-2 pt-2 border-t">{crop.description}</p>
                  )}
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={() => navigate(`/vyapari/place-bid/${crop.id}`, { state: { crop } })}
                >
                  {t('vyapari.placeBid')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableCrops;