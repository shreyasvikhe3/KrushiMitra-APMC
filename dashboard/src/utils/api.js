import axios from 'axios';

const resolveApiUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL;

  if (!configuredUrl) {
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.hostname}:8001`;
    }
    return 'http://localhost:8001';
  }

  try {
    const parsedUrl = new URL(configuredUrl);
    const isLocalPlaceholder = ['localhost', '127.0.0.1'].includes(parsedUrl.hostname);

    if (isLocalPlaceholder && typeof window !== 'undefined') {
      const currentHost = window.location.hostname;
      if (!['localhost', '127.0.0.1'].includes(currentHost)) {
        return `${parsedUrl.protocol}//${currentHost}:${parsedUrl.port || '8001'}`;
      }
    }

    return parsedUrl.toString().replace(/\/$/, '');
  } catch {
    return configuredUrl;
  }
};

const api = axios.create({
  baseURL: `${resolveApiUrl()}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
