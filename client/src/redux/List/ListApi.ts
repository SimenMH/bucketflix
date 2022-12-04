import { axiosAuthInstance } from '../../api/AxiosInstances';
import Cookies from 'universal-cookie';
import { resetUserState } from '../User/UserSlice';
import { resetListState } from './ListSlice';
import { Media, EditMediaData } from '../../types';

const cookies = new Cookies();

const errorHandler = (err: any, dispatch: any) => {
  const data = err.response.data;

  if (err.response.status === 403) {
    dispatch(resetUserState());
    dispatch(resetListState());
    cookies.remove('access_token');
  }
  return data.message;
};

export const getListsAPI = async (thunkAPI: any) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  const accessToken = cookies.get('access-token');

  try {
    const res = await axiosAuthInstance.get('/lists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (err: any) {
    return rejectWithValue(errorHandler(err, dispatch));
  }
};

export const addListAPI = async (listName: string, thunkAPI: any) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  const accessToken = cookies.get('access-token');

  try {
    const res = await axiosAuthInstance.post(
      '/lists',
      { name: listName },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res.data;
  } catch (err: any) {
    return rejectWithValue(errorHandler(err, dispatch));
  }
};

export const addMediaToListAPI = async (
  data: { listID: string; media: Media },
  thunkAPI: any
) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  const accessToken = cookies.get('access-token');

  try {
    const res = await axiosAuthInstance.post('/lists/media', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (err: any) {
    return rejectWithValue(errorHandler(err, dispatch));
  }
};

export const editMediaInListAPI = async (
  data: EditMediaData,
  thunkAPI: any
) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  const accessToken = cookies.get('access-token');

  try {
    const res = await axiosAuthInstance.put('/lists/media', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (err: any) {
    return rejectWithValue(errorHandler(err, dispatch));
  }
};

export const deleteMediaFromListAPI = async (
  data: { listID: string; mediaID: string },
  thunkAPI: any
) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  const accessToken = cookies.get('access-token');

  try {
    const res = await axiosAuthInstance.delete('/lists/media', {
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (err: any) {
    return rejectWithValue(errorHandler(err, dispatch));
  }
};
