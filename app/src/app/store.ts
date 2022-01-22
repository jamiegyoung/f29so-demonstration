import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import wallReducer from '../features/wall/wallSlice';

export const store = configureStore({
  reducer: {
    wall: wallReducer,
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
