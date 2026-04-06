import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import api from '../../utils/api';

const PlaceBid = () => {
  const { cropId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const crop = location.state?.crop;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cropId: cropId || crop?.id,
    bidAmount: crop?.basePrice || '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (parseFloat(formData.bidAmount) < parseFloat(crop?.basePrice || 0)) {
      toast.error(`Bid must be at least ₹${crop.basePrice}`);
      return;
    }

    setLoading(true);

    try {
      await api.post('/vyapari/bids', formData);
      toast.success(t('vyapari.bidPlaced'));
      navigate('/vyapari/my-bids');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error placing bid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('vyapari.placeBid')}</CardTitle>
        </CardHeader>
        <CardContent>
          {crop && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{t('vyapari.cropDetails')}</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-600">{t('shetkari.cropName')}:</span>{' '}
                  <span className="font-semibold">
                    {i18n.language === 'mr' ? crop.cropNameMarathi : crop.cropName}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">{t('vyapari.farmer')}:</span>{' '}
                  <span className="font-semibold">{crop.farmerName}</span>
                </p>
                <p>
                  <span className="text-gray-600">{t('shetkari.quantity')}:</span>{' '}
                  <span className="font-semibold">{crop.quantity} {t(`units.${crop.unit}`)}</span>
                </p>
                <p>
                  <span className="text-gray-600">{t('shetkari.basePrice')}:</span>{' '}
                  <span className="font-semibold text-green-600">₹{crop.basePrice}</span>
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bidAmount">{t('shetkari.bidAmount')} (₹ per {crop?.unit})</Label>
              <Input
                id="bidAmount"
                type="number"
                required
                min={crop?.basePrice || 0}
                value={formData.bidAmount}
                onChange={(e) => setFormData({ ...formData, bidAmount: e.target.value })}
                placeholder={crop?.basePrice?.toString()}
              />
              <p className="text-sm text-gray-500">
                Minimum bid: ₹{crop?.basePrice}
              </p>
              {formData.bidAmount && crop && (
                <p className="text-sm font-semibold text-green-600">
                  Total: ₹{(parseFloat(formData.bidAmount) * crop.quantity).toLocaleString()}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{t('vyapari.bidMessage')}</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t('vyapari.bidMessage')}
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? t('common.loading') : t('vyapari.placeBidButton')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/vyapari/crops')}
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceBid;