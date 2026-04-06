import React, { useEffect, useState } from 'react';
import { Download, Search, Trash2, Check, X } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

const Users = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter === 'approved') {
      filtered = filtered.filter((user) => user.isApproved);
    } else if (statusFilter === 'pending') {
      filtered = filtered.filter((user) => !user.isApproved);
    }

    setFilteredUsers(filtered);
  };

  const handleApprove = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}`, {
        isApproved: !currentStatus
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user status');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const downloadBlob = (data, filename) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/admin/export/users/csv', { responseType: 'blob' });
      downloadBlob(response.data, 'users.csv');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV');
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await api.get('/admin/export/users/pdf', { responseType: 'blob' });
      downloadBlob(response.data, 'users.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-12 text-center text-slate-600 dark:text-slate-300">Loading users...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div data-testid="users-page">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{t('userManagement')}</h1>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleExportCSV}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-white transition hover:bg-emerald-700 sm:w-auto"
              data-testid="export-csv-button"
            >
              <Download size={18} />
              {t('exportCsv')}
            </button>

            <button
              onClick={handleExportPDF}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-2.5 text-white transition hover:bg-rose-600 sm:w-auto"
              data-testid="export-pdf-button"
            >
              <Download size={18} />
              {t('exportPdf')}
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('search')}</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder={t('search')}
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 py-2.5 pl-10 pr-4 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:focus:ring-emerald-900/30"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white/90 p-2.5 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:focus:ring-emerald-900/30"
            >
              <option value="all">{t('allRoles')}</option>
              <option value="shetkari">{t('farmers')}</option>
              <option value="vyapari">{t('traders')}</option>
              <option value="karmachari">{t('officers')}</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white/90 p-2.5 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:focus:ring-emerald-900/30"
            >
              <option value="all">{t('allStatus')}</option>
              <option value="approved">{t('approved')}</option>
              <option value="pending">{t('pending')}</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] table-auto text-sm">
              <thead className="bg-slate-100/80 dark:bg-slate-950/80">
                <tr>
                  <th className="p-3 text-left text-slate-600 dark:text-slate-300">{t('user')}</th>
                  <th className="p-3 text-left text-slate-600 dark:text-slate-300">{t('email')}</th>
                  <th className="p-3 text-slate-600 dark:text-slate-300">{t('role')}</th>
                  <th className="p-3 text-slate-600 dark:text-slate-300">{t('status')}</th>
                  <th className="p-3 text-slate-600 dark:text-slate-300">{t('actions')}</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="p-3">
                        <div className="font-medium text-slate-900 dark:text-white">{user.fullName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">@{user.username}</div>
                      </td>

                      <td className="p-3 text-slate-700 dark:text-slate-300">{user.email}</td>
                      <td className="p-3 capitalize text-slate-700 dark:text-slate-300">{user.role}</td>
                      <td className="p-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.isApproved ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200'}`}>
                          {user.isApproved ? t('approved') : t('pending')}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex gap-2">
                          <button className="rounded-xl p-2 text-emerald-600 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40" onClick={() => handleApprove(user.id, user.isApproved)}>
                            {user.isApproved ? <X /> : <Check />}
                          </button>
                          <button className="rounded-xl p-2 text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/40" onClick={() => handleDelete(user.id)}>
                            <Trash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-slate-500 dark:text-slate-400">
                      {t('noUsersFound')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          {t('showing')} {filteredUsers.length} {t('of')} {users.length} {t('users').toLowerCase()}
        </div>
      </div>
    </Layout>
  );
};

export default Users;
