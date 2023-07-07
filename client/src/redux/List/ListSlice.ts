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
  leaveSharedListAPI,
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

export const leaveSharedList = createAsyncThunk(
  'lists/leaveSharedList',
  async (listID: string, thunkAPI) => leaveSharedListAPI(listID, thunkAPI)
);

interface ListState {
  selectedList: List | null;
  lists: Array<List>;
  sharedLists: Array<List>;
  status: string | null;
}

const initialState: ListState = {
  selectedList: null,
  lists: [],
  sharedLists: [],
  status: null,
};

export const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    updateSelectedList: (state, action) => {
      state.selectedList = action.payload;
    },
    resetListState: state => {
      state.selectedList = null;
      state.lists = [];
      state.status = null;
    },
  },
  extraReducers: builder => {
    // Helpers
    const updateListByID = (state: any, listID: string, newList: List) => {
      const ownListIdx = state.lists.findIndex(
        (list: List) => list._id === listID
      );

      if (ownListIdx > -1) {
        state.lists[ownListIdx] = newList;
        state.selectedList = state.lists[ownListIdx];
        return true;
      }

      const sharedListIdx = state.sharedLists.findIndex(
        (list: List) => list._id === listID
      );

      if (sharedListIdx > -1) {
        state.sharedLists[sharedListIdx] = {
          ...state.sharedLists[sharedListIdx],
          ...newList,
        };
        state.selectedList = state.sharedLists[sharedListIdx];
        return true;
      }

      return false;
    };

    // Get Lists
    builder.addCase(getLists.pending, (state, _action) => {
      state.status = 'loading';
    });
    builder.addCase(
      getLists.fulfilled,
      (
        state,
        action: PayloadAction<{ lists: List[]; shared_lists: List[] }>
      ) => {
        state.lists = action.payload.lists;
        state.sharedLists = action.payload.shared_lists;

        if (
          state.selectedList == null &&
          [...state.lists, ...state.sharedLists][0]
        ) {
          state.selectedList = [...state.lists, ...state.sharedLists][0];
        }

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
      (state, action: PayloadAction<List>) => {
        const idx = state.lists.findIndex(el => el._id === action.payload._id);
        state.lists[idx] = action.payload;
        state.selectedList = state.lists[idx];
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
      (state, action: PayloadAction<string>) => {
        const idx = state.lists.findIndex(el => el._id === action.payload);
        state.lists.splice(idx, 1);
        if ([...state.lists, ...state.sharedLists][0]) {
          state.selectedList = [...state.lists, ...state.sharedLists][0];
        } else {
          state.selectedList = null;
        }
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
        updateListByID(state, action.payload._id, action.payload);
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
        updateListByID(state, action.payload._id, action.payload);
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
        updateListByID(state, action.payload._id, action.payload);
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
        const idx = state.lists.findIndex(
          list => list._id === action.payload._id
        );
        state.lists[idx] = action.payload;
        state.selectedList = state.lists[idx];
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
        const idx = state.lists.findIndex(
          list => list._id === action.payload._id
        );
        state.lists[idx] = action.payload;
        state.selectedList = state.lists[idx];
        state.status = 'success';
      }
    );
    builder.addCase(removeSharedUser.rejected, (state, _action) => {
      state.status = 'failed';
    });

    // Leave Shared List
    builder.addCase(leaveSharedList.pending, (state, _action) => {
      state.status = 'loading';
    });
    builder.addCase(
      leaveSharedList.fulfilled,
      (state, action: PayloadAction<string>) => {
        const idx = state.sharedLists.findIndex(
          el => el._id === action.payload
        );

        state.sharedLists.splice(idx, 1);
        if ([...state.lists, ...state.sharedLists][0]) {
          state.selectedList = [...state.lists, ...state.sharedLists][0];
        } else {
          state.selectedList = null;
        }
        state.status = 'success';
      }
    );
    builder.addCase(leaveSharedList.rejected, (state, _action) => {
      state.status = 'failed';
    });
  },
});

export const { updateSelectedList, resetListState } = listsSlice.actions;

export default listsSlice.reducer;
