import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const PurchaseHistory = () => {
  const { t } = useTranslation();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await api.get('/vyapari/purchases');
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('vyapari.purchases')}</h1>

      {purchases.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">{t('vyapari.purchasesEmpty')}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('vyapari.purchases')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('shetkari.cropName')}</TableHead>
                    <TableHead>{t('vyapari.farmer')}</TableHead>
                    <TableHead>{t('shetkari.quantity')}</TableHead>
                    <TableHead>{t('shetkari.soldPrice')}</TableHead>
                    <TableHead>{t('shetkari.totalAmount')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>
                        {new Date(purchase.transactionDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{purchase.cropName}</TableCell>
                      <TableCell>{purchase.farmerName}</TableCell>
                      <TableCell>
                        {purchase.quantity} {t(`units.${purchase.unit}`)}
                      </TableCell>
                      <TableCell>₹{purchase.price}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        ₹{purchase.totalAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PurchaseHistory;