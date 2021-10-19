import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUserAPI } from '../api/userAPI';
import { LoginCredentials } from '../types';

export const userLogin = createAsyncThunk(
  'user/userLogin',
  async (loginCredentials: LoginCredentials) => loginUserAPI(loginCredentials)
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
  initialState: { ...initialState },
  reducers: {
    resetUserState: state => {
      state = { ...initialState };
    },
  },
  extraReducers: builder => {
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
  },
});

export const { resetUserState } = userSlice.actions;

export default userSlice.reducer;
