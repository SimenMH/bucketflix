import axiosAuthInstance from './axiosAuthInstance';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const getListsAPI = async (thunkAPI: any) => {
  const { rejectWithValue } = thunkAPI;
  const accessToken = cookies.get('access-token');

  try {
    const res = await axiosAuthInstance.get('/lists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(res);

    return res.data;
  } catch (err: any) {
    const data = err.response.data;
    return rejectWithValue(data.message);
  }
};

export const addListAPI = async (listName: string, thunkAPI: any) => {
  const { rejectWithValue } = thunkAPI;
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
    const data = err.response.data;
    return rejectWithValue(data.message);
  }
};
