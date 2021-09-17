import { createSlice } from '@reduxjs/toolkit';

import { tempMovies, tempSeries } from '../screens/MyLists/TempData';

export const listsSlice = createSlice({
  name: 'lists',
  initialState: {
    activeList: 0,
    lists: [
      {
        name: 'Personal',
        movies: tempMovies,
        series: tempSeries,
      },
      {
        name: 'Lille Bolle',
        movies: tempMovies,
        series: tempSeries,
      },
      {
        name: 'Harrison',
        movies: tempMovies,
        series: tempSeries,
      },
    ],
  },
  reducers: {},
});
