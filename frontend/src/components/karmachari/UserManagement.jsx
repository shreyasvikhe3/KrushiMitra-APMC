import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'sonner';
import api from '../../utils/api';

const UserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchUsers(activeTab);
  }, [activeTab]);

  const fetchUsers = async (status) => {
    setLoading(true);
    try {
      const response = await api.get(`/karmachari/users?status=${status}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.put(`/karmachari/users/${userId}`, { isApproved: true });
      toast.success('User approved successfully');
      fetchUsers(activeTab);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error approving user');
    }
  };

  const handleReject = async (userId) => {
    try {
      await api.put(`/karmachari/users/${userId}`, { isActive: false });
      toast.success('User rejected');
      fetchUsers(activeTab);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error rejecting user');
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      await api.put(`/karmachari/users/${userId}`, { isActive: !currentStatus });
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchUsers(activeTab);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating user');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('karmachari.userManagement')}</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending">{t('karmachari.pendingApprovals')}</TabsTrigger>
          <TabsTrigger value="approved">{t('karmachari.approvedUsers')}</TabsTrigger>
          <TabsTrigger value="all">{t('karmachari.allUsers')}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <LoadingSpinner />
          ) : users.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">{t('karmachari.noUsers')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{user.fullName}</CardTitle>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline">{t(`roles.${user.role}`)}</Badge>
                        <Badge variant={user.isApproved ? 'default' : 'secondary'}>
                          {user.isApproved ? t('messages.approved') : t('messages.pending')}
                        </Badge>
                        <Badge variant={user.isActive ? 'default' : 'destructive'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm mb-4">
                      <p>
                        <span className="text-gray-600">Email:</span> {user.email}
                      </p>
                      <p>
                        <span className="text-gray-600">Phone:</span> {user.phone}
                      </p>
                      {user.address && (
                        <p>
                          <span className="text-gray-600">Address:</span> {user.address}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        Registered: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {!user.isApproved && (
                        <Button
                          onClick={() => handleApprove(user.id)}
                          size="sm"
                          className="flex-1"
                        >
                          {t('karmachari.approve')}
                        </Button>
                      )}
                      <Button
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                        variant={user.isActive ? 'destructive' : 'default'}
                        size="sm"
                        className="flex-1"
                      >
                        {user.isActive ? t('karmachari.deactivate') : t('karmachari.activate')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;