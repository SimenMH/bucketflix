import { generateAccessToken } from './generateAccessToken';
import axios from 'axios';

const axiosAuthInstance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

axiosAuthInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const { config } = error;
    if (error.response) {
      if (error.response.status === 401 && !config._retry) {
        config._retry = true;
        const newToken = await generateAccessToken();
        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`;
          return axiosAuthInstance(config);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosAuthInstance;
