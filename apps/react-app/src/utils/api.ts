import config from '@/config';
import axios from 'axios';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      if (window.location.pathname === '/auth') {
        return;
      } else {
        window.location.href = '/auth';
      }
    }

    return Promise.reject(err);
  }
);

export default api;
