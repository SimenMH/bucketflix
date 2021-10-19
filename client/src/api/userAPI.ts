import axios, { AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import { resetListState } from '../redux/lists';
import { LoginCredentials } from '../types';

const cookies = new Cookies();

export const loginUserAPI = async ({ email, password }: LoginCredentials) => {
  try {
    const res: AxiosResponse<{ accessToken: string }> = await axios.post(
      '/users/login',
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    cookies.set('access-token', res.data.accessToken, {
      maxAge: 5 * 60, // 5m
    });

    const decoded = jwt_decode(res.data.accessToken);
    return decoded;
  } catch (err: any) {
    if (err.response) {
      return err.response;
    }
    return err;
  }
};

export const logoutUserAPI = async (thunkAPI: any) => {
  try {
    const { dispatch } = thunkAPI;
    await axios.post('/users/logout', {
      withCredentials: true,
    });

    cookies.set('access-token', '', {
      maxAge: 0,
    });

    dispatch(resetListState());
    return;
  } catch (err: any) {
    if (err.response) {
      return err.response;
    }
    return err;
  }
};
