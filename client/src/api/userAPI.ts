import axios, { AxiosResponse } from 'axios';
import jwt_decode from 'jwt-decode';
import { resetListState } from '../redux/lists';
import { LoginCredentials } from '../types';

export const loginUserAPI = async (
  { email, password }: LoginCredentials,
  thunkAPI: any
) => {
  const { rejectWithValue } = thunkAPI;
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

    const decoded = jwt_decode(res.data.accessToken);
    return decoded;
  } catch (err: any) {
    if (err.response) {
      rejectWithValue(err.response);
    }
    return rejectWithValue(null);
  }
};

export const logoutUserAPI = async (thunkAPI: any) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    await axios.post('/users/logout', {
      withCredentials: true,
    });

    dispatch(resetListState());
  } catch (err: any) {
    if (err.response) {
      rejectWithValue(err.response);
    }
    return rejectWithValue(null);
  }
};
