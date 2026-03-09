import axios from 'axios';
import { getToken } from '../context/AuthContext';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('talentscout_token');
      localStorage.removeItem('talentscout_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
