import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import api from '../../utils/api';
import MarketPrices from '../shetkari/MarketPrices';

const UpdateMarketPrices = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cropName: '',
    cropNameMarathi: '',
    minPrice: '',
    maxPrice: '',
    avgPrice: '',
    unit: 'quintal'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/karmachari/market-prices', formData);
      toast.success('Market price updated successfully');
      setFormData({
        cropName: '',
        cropNameMarathi: '',
        minPrice: '',
        maxPrice: '',
        avgPrice: '',
        unit: 'quintal'
      });
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating price');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('karmachari.marketPrices')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('karmachari.updatePrice')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cropName">{t('shetkari.cropName')} (English)</Label>
                <Input
                  id="cropName"
                  required
                  value={formData.cropName}
                  onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  placeholder="Wheat, Rice..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cropNameMarathi">{t('shetkari.cropName')} (मराठी)</Label>
                <Input
                  id="cropNameMarathi"
                  required
                  value={formData.cropNameMarathi}
                  onChange={(e) => setFormData({ ...formData, cropNameMarathi: e.target.value })}
                  placeholder="गहू, तांदूळ..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minPrice">{t('karmachari.minPrice')} (₹)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  required
                  value={formData.minPrice}
                  onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                  placeholder="2000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPrice">{t('karmachari.maxPrice')} (₹)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  required
                  value={formData.maxPrice}
                  onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                  placeholder="2500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avgPrice">{t('karmachari.avgPrice')} (₹)</Label>
                <Input
                  id="avgPrice"
                  type="number"
                  required
                  value={formData.avgPrice}
                  onChange={(e) => setFormData({ ...formData, avgPrice: e.target.value })}
                  placeholder="2250"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t('common.loading') : t('karmachari.updatePrice')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <MarketPrices />
        </div>
      </div>
    </div>
  );
};

export default UpdateMarketPrices;