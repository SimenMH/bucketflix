import axios from 'axios';
import Cookies from 'universal-cookie';
import { generateAccessToken } from './GenerateAccessToken';

const cookies = new Cookies();

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

export const axiosAuthInstance = axios.create();

axiosAuthInstance.interceptors.request.use(
  config => {
    if (!config.headers) config.headers = {};
    config.headers['Authorization'] = `Bearer ${cookies.get('access-token')}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

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
