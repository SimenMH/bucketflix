import axios, { AxiosResponse } from 'axios';
import jwt_decode from 'jwt-decode';
import { resetListState } from '../List/ListSlice';
import { User, NewUser, LoginCredentials } from '../../types';
import { generateAccessToken } from '../../api/GenerateAccessToken';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const registerUserApi = async (newUser: NewUser, thunkAPI: any) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const res: AxiosResponse<{ accessToken: string }> = await axios.post(
      '/users',
      newUser,
      { withCredentials: true }
    );

    const decoded: User = jwt_decode(res.data.accessToken);
    return decoded;
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data);
    }

    throw err;
  }
};

export const loginUserApi = async (
  loginCredentials: LoginCredentials,
  thunkAPI: any
) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const res: AxiosResponse<{ accessToken: string }> = await axios.post(
      '/users/login',
      loginCredentials,
      { withCredentials: true }
    );

    const decoded: User = jwt_decode(res.data.accessToken);
    return decoded;
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data);
    }

    throw err;
  }
};

export const logoutUserApi = async (thunkAPI: any) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    await axios.post('/users/logout', {
      withCredentials: true,
    });

    dispatch(resetListState());
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data);
    }

    throw err;
  }
};

export const sessionLoginApi = async (thunkAPI: any) => {
  const { rejectWithValue } = thunkAPI;
  try {
    let accessToken = cookies.get('access-token');

    if (!accessToken) {
      accessToken = await generateAccessToken();
    }
    const decoded: { username: string; email: string } =
      jwt_decode(accessToken);

    return decoded;
  } catch (err) {
    return rejectWithValue(null);
  }
};

export const findUser = async (name: string) => {
  try {
    const res: AxiosResponse<{ user_id: string; username: string }> =
      await axios.get(`/users/${name}`);
    if (res.status === 200) {
      return res.data;
    } else {
      return null;
    }
  } catch (err: any) {
    return null;
  }
};
