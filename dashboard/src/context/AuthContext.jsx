import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();
const ADMIN_TOKEN_KEY = 'adminToken';
const ADMIN_USER_KEY = 'adminUser';

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

    sessionStorage.setItem(ADMIN_TOKEN_KEY, payload.token);
    sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  useEffect(() => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    const savedUser = sessionStorage.getItem(ADMIN_USER_KEY);
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Clear old persistent data from previous deployments.
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);

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
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
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
