import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  addListAPI,
  getListsAPI,
  addMediaToListAPI,
  editMediaInListAPI,
  deleteMediaFromListAPI,
} from './ListApi';
import { List, Media, EditMediaData } from '../../types';

export const getLists = createAsyncThunk(
  'lists/getLists',
  async (_, thunkAPI) => getListsAPI(thunkAPI)
);

export const addList = createAsyncThunk(
  'lists/addList',
  async (listName: string, thunkAPI) => addListAPI(listName, thunkAPI)
);

export const addMediaToList = createAsyncThunk(
  'lists/addMediaToList',
  async (data: { listID: string; media: Media }, thunkAPI) =>
    addMediaToListAPI(data, thunkAPI)
);

export const editMediaInList = createAsyncThunk(
  'lists/editMediaInList',
  async (data: EditMediaData, thunkAPI) => editMediaInListAPI(data, thunkAPI)
);

export const deleteMediaFromList = createAsyncThunk(
  'lists/deleteMediaFromList',
  async (data: { listID: string; mediaID: string }, thunkAPI) =>
    deleteMediaFromListAPI(data, thunkAPI)
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
    resetListState: state => {
      state.activeList = 0;
      state.lists = [];
      state.status = null;
    },
  },
  extraReducers: builder => {
    // Get Lists
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

    // Add List
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

    // Add Media to List
    builder.addCase(addMediaToList.pending, (state, _action) => {
      state.status = 'loading';
    });
    builder.addCase(
      addMediaToList.fulfilled,
      (state, action: PayloadAction<List>) => {
        const listIdx = state.lists.findIndex(
          list => list._id === action.payload._id
        );
        state.lists[listIdx] = action.payload;
        state.status = 'success';
      }
    );
    builder.addCase(addMediaToList.rejected, (state, _action) => {
      state.status = 'failed';
    });

    // Edit Media in List
    builder.addCase(editMediaInList.pending, (state, _action) => {
      state.status = 'loading';
    });
    builder.addCase(
      editMediaInList.fulfilled,
      (state, action: PayloadAction<List>) => {
        const listIdx = state.lists.findIndex(
          list => list._id === action.payload._id
        );
        state.lists[listIdx] = action.payload;
        state.status = 'success';
      }
    );
    builder.addCase(editMediaInList.rejected, (state, _action) => {
      state.status = 'failed';
    });

    // Remove Media from List
    builder.addCase(deleteMediaFromList.pending, (state, _action) => {
      state.status = 'loading';
    });
    builder.addCase(
      deleteMediaFromList.fulfilled,
      (state, action: PayloadAction<List>) => {
        const listIdx = state.lists.findIndex(
          list => list._id === action.payload._id
        );
        state.lists[listIdx] = action.payload;
        state.status = 'success';
      }
    );
    builder.addCase(deleteMediaFromList.rejected, (state, _action) => {
      state.status = 'failed';
    });
  },
});

export const { updateActiveList, resetListState } = listsSlice.actions;

export default listsSlice.reducer;
