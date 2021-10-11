import axios, { AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const generateAccessToken = async () => {
  const res: AxiosResponse<{ accessToken: string }> = await axios.post(
    'http://localhost:5000/token',
    null,
    {
      withCredentials: true,
    }
  );

  cookies.set('access-token', res.data.accessToken, {
    maxAge: 5 * 60, // 5m
  });

  return res.data.accessToken;
};
