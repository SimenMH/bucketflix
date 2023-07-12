import { AxiosResponse } from 'axios';
import { axiosAuthInstance } from './AxiosInstances';
import { Media } from '../types';

export const searchForTitle = async (title: string) => {
  try {
    title = title.toLowerCase().trim();
    const res: AxiosResponse<{ results: Array<Media> }> =
      await axiosAuthInstance.get(`/media?s=${title}`);
    if (res.data.results) {
      return res.data.results;
    } else {
      return [];
    }
  } catch (err) {
    return [];
  }
};

export const searchForId = async (id: string) => {
  try {
    const res: AxiosResponse<Media> = await axiosAuthInstance.get(
      `/media/${id}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};
