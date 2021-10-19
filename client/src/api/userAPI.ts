import axios, { AxiosResponse } from 'axios';
import jwt_decode from 'jwt-decode';
import { LoginCredentials } from '../types';

export const loginUserAPI = async ({ email, password }: LoginCredentials) => {
  try {
    const response: AxiosResponse<{ accessToken: string }> = await axios.post(
      '/users/login',
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    const decoded = jwt_decode(response.data.accessToken);
    return decoded;
  } catch (err: any) {
    if (err.response) {
      console.log(err.response);
      return err.response;
    }
    return err;
  }
};
