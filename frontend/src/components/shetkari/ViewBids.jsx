import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'sonner';
import api from '../../utils/api';

const ViewBids = () => {
  const { cropId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBids();
  }, [cropId]);

  const fetchBids = async () => {
    try {
      const response = await api.get(`/shetkari/bids/${cropId}`);
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast.error('Error loading bids');
    } finally {
      setLoading(false);
    }
  };

  const handleBidAction = async (bidId, status) => {
    try {
      await api.put(`/shetkari/bids/${bidId}`, { status });
      toast.success(`Bid ${status} successfully`);
      fetchBids();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating bid');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('shetkari.viewBids')}</h1>
        <Button variant="outline" onClick={() => navigate('/shetkari/my-crops')}>
          {t('common.back')}
        </Button>
      </div>

      {bids.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">{t('shetkari.noBids')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <Card key={bid.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{bid.traderName}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(bid.createdAt).toLocaleDateString()}
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
                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{t('shetkari.bidAmount')}:</span>
                    <span className="text-green-600">₹{bid.bidAmount}</span>
                  </div>
                  {bid.message && (
                    <div className="mt-2 p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">{bid.message}</p>
                    </div>
                  )}
                  {bid.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleBidAction(bid.id, 'accepted')}
                        className="flex-1"
                      >
                        {t('shetkari.acceptBid')}
                      </Button>
                      <Button
                        onClick={() => handleBidAction(bid.id, 'rejected')}
                        variant="destructive"
                        className="flex-1"
                      >
                        {t('shetkari.rejectBid')}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewBids;