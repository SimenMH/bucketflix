import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  deleteUserAPI,
  loginUserApi,
  logoutUserApi,
  registerUserApi,
  sessionLoginApi,
  updateUserAPI,
} from './UserApi';
import { NewUser, LoginCredentials } from '../../types';

export const userRegister = createAsyncThunk(
  'user/userRegister',
  async (newUser: NewUser, thunkAPI) => registerUserApi(newUser, thunkAPI)
);

export const userLogin = createAsyncThunk(
  'user/userLogin',
  async (loginCredentials: LoginCredentials, thunkAPI) =>
    loginUserApi(loginCredentials, thunkAPI)
);

export const userLogout = createAsyncThunk(
  'user/userLogout',
  async (_, thunkAPI) => logoutUserApi(thunkAPI)
);

export const sessionLogin = createAsyncThunk(
  'user/sessionLogin',
  async (_, thunkAPI) => sessionLoginApi(thunkAPI)
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    updatedValues: {
      newEmail?: string;
      newUsername?: string;
      newPassword?: { currentPassword: string; newPassword: string };
    },
    thunkAPI
  ) => updateUserAPI(updatedValues, thunkAPI)
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (password: string, thunkAPI) => deleteUserAPI(password, thunkAPI)
);

interface UserState {
  userID: string;
  username: string;
  email: string;
  loggedIn: boolean;
  status: null | string;
}

const initialState: UserState = {
  userID: '',
  username: '',
  email: '',
  loggedIn: false,
  status: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: state => {
      state.username = '';
      state.email = '';
      state.loggedIn = false;
      state.status = null;
    },
  },
  extraReducers: builder => {
    // User Register
    builder.addCase(userRegister.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(userRegister.fulfilled, (state, action) => {
      state.status = 'success';
    });
    builder.addCase(userRegister.rejected, state => {
      state.status = 'failed';
    });

    // User Login
    builder.addCase(userLogin.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.userID = action.payload._id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.loggedIn = true;
      state.status = 'success';
    });
    builder.addCase(userLogin.rejected, state => {
      state.status = 'failed';
    });

    // User Logout
    builder.addCase(userLogout.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(userLogout.fulfilled, state => {
      state.userID = '';
      state.username = '';
      state.email = '';
      state.loggedIn = false;
      state.status = 'success';
    });
    builder.addCase(userLogout.rejected, state => {
      state.status = 'failed';
    });

    // Session Login
    builder.addCase(sessionLogin.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(sessionLogin.fulfilled, (state, action) => {
      state.userID = action.payload._id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.loggedIn = true;
      state.status = 'success';
    });
    builder.addCase(sessionLogin.rejected, state => {
      state.status = 'failed';
    });

    // Update User
    builder.addCase(updateUser.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.userID = action.payload._id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.status = 'success';
    });
    builder.addCase(updateUser.rejected, state => {
      state.status = 'failed';
    });

    // Delete User
    builder.addCase(deleteUser.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(deleteUser.fulfilled, state => {
      state.userID = '';
      state.username = '';
      state.email = '';
      state.loggedIn = false;
      state.status = 'success';
    });
    builder.addCase(deleteUser.rejected, state => {
      state.status = 'failed';
    });
  },
});

export const { resetUserState } = userSlice.actions;

export default userSlice.reducer;
