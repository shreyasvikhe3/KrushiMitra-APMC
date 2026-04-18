import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);
const AUTH_TOKEN_KEY = 'token';
const AUTH_USER_KEY = 'user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const userData = sessionStorage.getItem(AUTH_USER_KEY);
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    // Clear old persistent data from previous deployments.
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    setLoading(false);
  }, []);

  const persistAuth = (payload) => {
    const { token, ...userData } = payload;

    if (!token || !userData?.isApproved) {
      return userData;
    }

    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const userData = persistAuth(response.data);

      return { success: true, data: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const user = persistAuth(response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  };

  const googleAuth = async (payload) => {
    try {
      const response = await api.post('/auth/google', payload);
      const userData = persistAuth(response.data);

      return { success: true, data: userData };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Google sign-in failed'
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to send OTP' 
      };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { 
        email, 
        otp, 
        newPassword 
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to reset password' 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    googleAuth,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    isApproved: user?.isApproved || false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
