import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import { loginUserAPI, logoutUserAPI } from '../api/userAPI';
import { LoginCredentials } from '../types';

const cookies = new Cookies();

export const userLogin = createAsyncThunk(
  'user/userLogin',
  async (loginCredentials: LoginCredentials) => loginUserAPI(loginCredentials)
);

export const userLogout = createAsyncThunk(
  'user/userLogout',
  async (_, thunkAPI) => logoutUserAPI(thunkAPI)
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
    sessionLogin: state => {
      const accessToken = cookies.get('access-token');

      if (accessToken) {
        const decoded: { username: string; email: string } =
          jwt_decode(accessToken);

        state.username = decoded.username;
        state.email = decoded.email;
        state.loggedIn = true;
      }
    },
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
  },
});

export const { sessionLogin, resetUserState } = userSlice.actions;

export default userSlice.reducer;
