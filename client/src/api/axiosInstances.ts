import { generateAccessToken } from './generateAccessToken';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

export const axiosAuthInstance = axios.create();

axiosAuthInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const { config } = error;
    if (error.response) {
      if (error.response.status === 401 && !config._retry) {
        try {
          config._retry = true;
          const newToken = await generateAccessToken();
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
            return axiosAuthInstance(config);
          }
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(error);
  }
);
