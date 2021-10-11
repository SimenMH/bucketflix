import { axiosAuthInstance } from './axiosInstances';
import Cookies from 'universal-cookie';
import { resetListState } from '../redux/lists';

const cookies = new Cookies();

const errorHandler = (err: any, dispatch: any) => {
  const data = err.response.data;

  if (err.response.status === 403) {
    // Logout user in client
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
