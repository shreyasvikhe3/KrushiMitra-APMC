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

const API_BASE_URL = `${resolveApiUrl()}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL;       // http://localhost:8001
// const API_BASE_URL = `${API_URL}/api`;

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,  // ✅ important for cookies / credentials
// });

// // Add token from localStorage if available
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Handle 401 responses globally
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
