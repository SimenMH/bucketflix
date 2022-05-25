import axios, { AxiosResponse } from 'axios';

export const generateAccessToken = async () => {
  const res: AxiosResponse<{ accessToken: string }> = await axios.post(
    'http://localhost:5000/token',
    null,
    {
      withCredentials: true,
    }
  );

  return res.data.accessToken;
};
