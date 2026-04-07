import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'An error occurred';
      const isLoginPage = window.location.pathname === '/login';
      
      if (status === 401) {
        if (!isLoginPage) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        }
      } else if (status === 403) {
        toast.error('Access denied. You do not have permission for this action.');
      } else if (status === 404) {
        toast.error('Resource not found.');
      } else if (status >= 500) {
        toast.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
