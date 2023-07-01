import { AxiosResponse } from 'axios';
import { axiosAuthInstance } from './AxiosInstances';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const generateListInvite = async (listID: string) => {
  try {
    const accessToken = cookies.get('access-token');
    const res: AxiosResponse<{ inviteCode: string }> =
      await axiosAuthInstance.post(
        '/lists/invite',
        { listID },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

    return res.data.inviteCode;
  } catch (err: any) {
    return null;
  }
};
