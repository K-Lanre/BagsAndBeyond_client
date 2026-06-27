import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

export { BASE_URL };

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for auth tokens if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token && config.url.includes('/admin')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
