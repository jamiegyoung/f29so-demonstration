import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import fetchApi from '../../app/fetchApi';
import { UserState, v1 } from '../../types';

const initialState: UserState = {
  status: 'idle',
  user: null,
};

type FetchUserPayload = {
  id: number;
};

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (payload?: FetchUserPayload) => {
    if (payload)
      return fetchApi(v1.routes.user, {params: [payload.id.toString(10)]}).then((res) =>
        res.json(),
      );
    return fetchApi(v1.routes.selfUser).then(async (res) => res.json());
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.status = 'idle';
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload;
        state.status = 'success';
      }
    });
    builder.addCase(fetchUser.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.status = 'error';
    });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
