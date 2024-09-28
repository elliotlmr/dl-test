import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      if (
        window.location.pathname === '/login' ||
        window.location.pathname === '/register'
      ) {
        return;
      } else {
        window.location.href = '/login';
      }
    }

    return Promise.reject(err);
  }
);

export default api;
