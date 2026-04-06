import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistUserSession = (payload) => {
    const userData = payload.user || {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      fullName: payload.fullName,
      phone: payload.phone,
      address: payload.address,
      isApproved: payload.isApproved,
      isActive: payload.isActive
    };

    if (!['admin', 'superadmin'].includes(userData.role)) {
      throw new Error('Access denied. Admin privileges required.');
    }

    localStorage.setItem('adminToken', payload.token);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    const isEmail = identifier.includes('@');

    const response = await api.post('/auth/login', {
      email: isEmail ? identifier : undefined,
      username: !isEmail ? identifier : undefined,
      password
    });

    return persistUserSession(response.data);
  };

  const bootstrapAdmin = async (formData) => {
    const response = await api.post('/auth/bootstrap-admin', formData);
    return persistUserSession(response.data);
  };

  const googleLogin = async (credential) => {
    const response = await api.post('/auth/google', {
      credential,
      createIfMissing: false
    });

    return persistUserSession(response.data);
  };

  const getBootstrapStatus = async () => {
    const response = await api.get('/auth/bootstrap-status');
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  const value = {
    user,
    login,
    googleLogin,
    bootstrapAdmin,
    getBootstrapStatus,
    logout,
    loading,
    isAdmin: user?.role === 'admin',
    isSuperAdmin: user?.role === 'superadmin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
