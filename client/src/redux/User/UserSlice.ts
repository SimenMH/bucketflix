import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import { loginUserAPI, logoutUserAPI } from './UserApi';
import { LoginCredentials } from '../../types';
import { generateAccessToken } from '../../api/generateAccessToken';

const cookies = new Cookies();

export const userLogin = createAsyncThunk(
  'user/userLogin',
  async (loginCredentials: LoginCredentials, thunkAPI) =>
    loginUserAPI(loginCredentials, thunkAPI)
);

export const userLogout = createAsyncThunk(
  'user/userLogout',
  async (_, thunkAPI) => logoutUserAPI(thunkAPI)
);

export const sessionLogin = createAsyncThunk(
  'user/sessionLogin',
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      let accessToken = cookies.get('access-token');

      if (!accessToken) {
        accessToken = await generateAccessToken();
      }
      const decoded: { username: string; email: string } =
        jwt_decode(accessToken);

      return decoded;
    } catch (err) {
      return rejectWithValue(null);
    }
  }
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

export const { resetUserState } = userSlice.actions;

export default userSlice.reducer;
