import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { addListAPI, getListsAPI } from '../api/listAPI';
import { List } from '../types';

import { tempMovies, tempSeries } from './TempData';

export const getLists = createAsyncThunk(
  'lists/getLists',
  async (_, thunkAPI) => getListsAPI(thunkAPI)
);

export const addList = createAsyncThunk(
  'lists/addList',
  async (listName: string, thunkAPI) => addListAPI(listName, thunkAPI)
);

interface ListState {
  activeList: number;
  lists: Array<List>;
  status: null | string;
}

const initialState: ListState = {
  activeList: 0,
  lists: [],
  status: null,
};

export const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    updateActiveList: (state, action) => {
      state.activeList = action.payload;
    },
    // addMediaToList: (state, action) => {
    //   const { listIdx, media } = action.payload;
    //   if (media.Type === 'movie') {
    //     state.lists[listIdx].movies.push(media);
    //   } else {
    //     state.lists[listIdx].series.push(media);
    //   }
    // },
  },
  extraReducers: builder => {
    builder.addCase(getLists.pending, (state, _action) => {
      state.status = 'loading';
    });
    builder.addCase(
      getLists.fulfilled,
      (state, action: PayloadAction<{ lists: List[] }>) => {
        state.lists = action.payload.lists;
        state.status = 'success';
      }
    );
    builder.addCase(getLists.rejected, (state, _action) => {
      state.status = 'failed';
    });

    builder.addCase(addList.pending, (state, _action) => {
      state.status = 'loading';
    });
    builder.addCase(addList.fulfilled, (state, action: PayloadAction<List>) => {
      state.lists.push(action.payload);
      state.status = 'success';
    });
    builder.addCase(addList.rejected, (state, _action) => {
      state.status = 'failed';
    });
  },
});

export const { updateActiveList } = listsSlice.actions;

export default listsSlice.reducer;
