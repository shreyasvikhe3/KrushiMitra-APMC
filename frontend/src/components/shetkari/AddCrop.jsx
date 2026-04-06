import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import api from '../../utils/api';

const AddCrop = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cropName: '',
    cropNameMarathi: '',
    quantity: '',
    unit: 'quintal',
    basePrice: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/shetkari/crops', formData);
      toast.success(t('shetkari.addCropSuccess'));
      navigate('/shetkari/my-crops');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding crop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('shetkari.addCrop')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cropName">{t('shetkari.cropName')} (English)</Label>
                <Input
                  id="cropName"
                  required
                  value={formData.cropName}
                  onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  placeholder="Wheat, Rice, Cotton..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cropNameMarathi">{t('shetkari.cropName')} (मराठी)</Label>
                <Input
                  id="cropNameMarathi"
                  required
                  value={formData.cropNameMarathi}
                  onChange={(e) => setFormData({ ...formData, cropNameMarathi: e.target.value })}
                  placeholder="गहू, तांदूळ, कापूस..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">{t('shetkari.quantity')}</Label>
                <Input
                  id="quantity"
                  type="number"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">{t('shetkari.unit')}</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">{t('units.kg')}</SelectItem>
                    <SelectItem value="quintal">{t('units.quintal')}</SelectItem>
                    <SelectItem value="ton">{t('units.ton')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="basePrice">{t('shetkari.basePrice')} (₹ per {formData.unit})</Label>
                <Input
                  id="basePrice"
                  type="number"
                  required
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  placeholder="2000"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">{t('shetkari.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('shetkari.description')}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? t('common.loading') : t('common.submit')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/shetkari/dashboard')}
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

export default AddCrop;