import axios, { AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const generateAccessToken = async () => {
  const res: AxiosResponse<{ accessToken: string }> = await axios.post(
    '/token',
    { refreshToken: cookies.get('refresh-token') },
    {
      withCredentials: true,
    }
  );

  return res.data.accessToken;
};
