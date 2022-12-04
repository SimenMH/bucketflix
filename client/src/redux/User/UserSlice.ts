import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUserApi, logoutUserApi, sessionLoginApi } from './UserApi';
import { LoginCredentials } from '../../types';

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

interface UserState {
  username: string;
  email: string;
  loggedIn: boolean;
  status: null | string;
}

const initialState: UserState = {
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
    // User Login
    builder.addCase(userLogin.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
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
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.loggedIn = true;
      state.status = 'success';
    });
    builder.addCase(sessionLogin.rejected, state => {
      state.status = 'failed';
    });
  },
});

export const { resetUserState } = userSlice.actions;

export default userSlice.reducer;
