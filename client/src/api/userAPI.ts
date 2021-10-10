import axios from 'axios';

export const tempUserLogin = async () => {
  try {
    const response = await axios.post(
      'http://localhost:5000/users/login',
      {
        email: 'john@example.com',
        password: '123456',
      },
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (err: any) {
    const data = err.response.data;
    return data;
  }
};
