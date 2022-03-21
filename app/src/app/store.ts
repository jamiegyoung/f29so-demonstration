import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import wallReducer from '../features/wall/wallSlice';
import feedReducer from '../features/feed/feedSlice';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    wall: wallReducer,
    feed: feedReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
