import axios from 'axios';
import AuthService from '../services/AuthService';

export function useUnauthorizedInterceptor() {
  axios.interceptors.response.use(function (response) {
    return response;
  }, function (err) {
    if (401 === err.response.status) {
      AuthService.signOut();
    } else {
      return Promise.reject(err);
    }
  });
}

