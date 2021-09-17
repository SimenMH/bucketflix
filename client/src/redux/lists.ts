import { createSlice } from '@reduxjs/toolkit';

import { tempMovies, tempSeries } from './TempData';

export const listsSlice = createSlice({
  name: 'lists',
  initialState: {
    activeList: 0,
    lists: [
      {
        name: 'Personal',
        movies: [...tempMovies, ...tempMovies],
        series: [...tempSeries, ...tempSeries],
      },
      {
        name: 'Lille Bolle',
        movies: [],
        series: tempSeries,
      },
      {
        name: 'Harrison',
        movies: tempMovies,
        series: [],
      },
    ],
  },
  reducers: {
    updateActiveList: (state, action) => {
      state.activeList = action.payload;
    },
    addList: (state, action) => {
      state.lists.push({
        name: action.payload,
        movies: [],
        series: [],
      });
      state.activeList = state.lists.length - 1;
    },
  },
});

export const { updateActiveList, addList } = listsSlice.actions;

export default listsSlice.reducer;