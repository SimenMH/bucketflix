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

export const editListAPI = async (
  listData: {
    listID: string;
    updatedValues: { name?: string };
  },
  thunkAPI: any
) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  const accessToken = cookies.get('access-token');

  try {
    const res = await axiosAuthInstance.put('/lists', listData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (err: any) {
    return rejectWithValue(errorHandler(err, dispatch));
  }
};

export const deleteListAPI = async (listID: string, thunkAPI: any) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    await axiosAuthInstance.delete('/lists', {
      data: { listID },
    });
    return listID;
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

export const editSharedUserAPI = async (
  data: {
    listID: string;
    sharedUserID: string;
    updatedValues: { canEdit?: boolean };
  },
  thunkAPI: any
) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  const accessToken = cookies.get('access-token');

  try {
    const res = await axiosAuthInstance.put('/lists/users', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (err: any) {
    return rejectWithValue(errorHandler(err, dispatch));
  }
};

export const removeSharedUserAPI = async (
  data: { listID: string; sharedUserID: string },
  thunkAPI: any
) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  const accessToken = cookies.get('access-token');

  try {
    const res = await axiosAuthInstance.delete('/lists/users', {
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

export const leaveSharedListAPI = async (listID: string, thunkAPI: any) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    await axiosAuthInstance.delete('/lists/leave', {
      data: { listID },
    });

    return listID;
  } catch (err: any) {
    return rejectWithValue(errorHandler(err, dispatch));
  }
};
