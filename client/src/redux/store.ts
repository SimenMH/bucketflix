import { configureStore } from '@reduxjs/toolkit';
import listsReducer from './lists';
import userReducer from './user';

const store = configureStore({
  reducer: {
    lists: listsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
