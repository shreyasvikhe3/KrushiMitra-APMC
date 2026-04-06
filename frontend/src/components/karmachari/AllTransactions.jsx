import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const AllTransactions = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/karmachari/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('karmachari.allTransactions')}</h1>

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">{t('messages.noData')}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {t('karmachari.statistics.totalTransactions')}: {transactions.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('shetkari.cropName')}</TableHead>
                    <TableHead>{t('vyapari.farmer')}</TableHead>
                    <TableHead>Trader</TableHead>
                    <TableHead>{t('shetkari.quantity')}</TableHead>
                    <TableHead>{t('shetkari.soldPrice')}</TableHead>
                    <TableHead>{t('shetkari.totalAmount')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-mono text-xs">
                        {txn.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {new Date(txn.transactionDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{txn.cropName}</TableCell>
                      <TableCell>{txn.farmerName}</TableCell>
                      <TableCell>{txn.traderName}</TableCell>
                      <TableCell>
                        {txn.quantity} {t(`units.${txn.unit}`)}
                      </TableCell>
                      <TableCell>₹{txn.price}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        ₹{txn.totalAmount.toLocaleString()}
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

export default AllTransactions;