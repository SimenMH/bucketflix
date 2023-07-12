import { configureStore } from '@reduxjs/toolkit';
import listsReducer from './List/ListSlice';
import userReducer from './User/UserSlice';

const store = configureStore({
  reducer: {
    lists: listsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
