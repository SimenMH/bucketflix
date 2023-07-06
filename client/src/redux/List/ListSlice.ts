import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  addListAPI,
  getListsAPI,
  addMediaToListAPI,
  editMediaInListAPI,
  deleteMediaFromListAPI,
  editListAPI,
  editSharedUserAPI,
  removeSharedUserAPI,
  deleteListAPI,
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

export const editList = createAsyncThunk(
  'lists/editList',
  async (
    listData: {
      listID: string;
      updatedValues: { name?: string };
    },
    thunkAPI
  ) => editListAPI(listData, thunkAPI)
);

export const deleteList = createAsyncThunk(
  'lists/deleteList',
  async (listID: string, thunkAPI) => deleteListAPI(listID, thunkAPI)
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

export const editSharedUser = createAsyncThunk(
  'lists/editSharedUsers',
  async (
    data: {
      listID: string;
      sharedUserID: string;
      updatedValues: { canEdit?: boolean };
    },
    thunkAPI
  ) => editSharedUserAPI(data, thunkAPI)
);

export const removeSharedUser = createAsyncThunk(
  'lists/removeSharedUser',
  async (data: { listID: string; sharedUserID: string }, thunkAPI) =>
    removeSharedUserAPI(data, thunkAPI)
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

    // Edit List
    builder.addCase(editList.pending, (state, _action) => {
      state.status = 'loading';
    });
    builder.addCase(
      editList.fulfilled,
      (state, action: PayloadAction<string>) => {
        const idx = state.lists.findIndex(el => el._id === action.payload);
        state.lists.splice(idx, 1);
        state.status = 'success';
      }
    );
    builder.addCase(editList.rejected, (state, _action) => {
      state.status = 'failed';
    });

    // Delete List
    builder.addCase(deleteList.pending, (state, _action) => {
      state.status = 'loading';
    });
    builder.addCase(
      deleteList.fulfilled,
      (state, action: PayloadAction<List>) => {
        const idx = state.lists.findIndex(el => el._id === action.payload._id);
        state.lists[idx] = action.payload;
        state.status = 'success';
      }
    );
    builder.addCase(deleteList.rejected, (state, _action) => {
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
        state.activeList = 0;
        state.lists[listIdx] = action.payload;
        state.status = 'success';
      }
    );
    builder.addCase(deleteMediaFromList.rejected, (state, _action) => {
      state.status = 'failed';
    });

    // Edit Shared User in List
    builder.addCase(editSharedUser.pending, (state, _action) => {
      state.status = 'loading';
    });
    builder.addCase(
      editSharedUser.fulfilled,
      (state, action: PayloadAction<List>) => {
        const listIdx = state.lists.findIndex(
          list => list._id === action.payload._id
        );
        state.lists[listIdx] = action.payload;
        state.status = 'success';
      }
    );
    builder.addCase(editSharedUser.rejected, (state, _action) => {
      state.status = 'failed';
    });

    // Remove Shared User from List
    builder.addCase(removeSharedUser.pending, (state, _action) => {
      state.status = 'loading';
    });
    builder.addCase(
      removeSharedUser.fulfilled,
      (state, action: PayloadAction<List>) => {
        const listIdx = state.lists.findIndex(
          list => list._id === action.payload._id
        );
        state.lists[listIdx] = action.payload;
        state.status = 'success';
      }
    );
    builder.addCase(removeSharedUser.rejected, (state, _action) => {
      state.status = 'failed';
    });
  },
});

export const { updateActiveList, resetListState } = listsSlice.actions;

export default listsSlice.reducer;
