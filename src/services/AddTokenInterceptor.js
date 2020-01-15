import axios from 'axios';

export function useAddTokenInterceptor() {
  axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, function (err) {
    return Promise.reject(err);
  });
}
