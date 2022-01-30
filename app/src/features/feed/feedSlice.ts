import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import fetchApi from '../../app/fetchApi';
import { FeedState, v1 } from '../../types';

const initialState: FeedState = {
  status: 'idle',
  posts: [],
};

type FetchUserFeedPayload = {
  userID: number;
  page: number;
};

export const fetchUserFeed = createAsyncThunk(
  'feed/fetchUserFeed',
  async ({ userID, page }: FetchUserFeedPayload) =>
    fetchApi(v1.routes.getFeed, userID.toString(10), page.toString(10)).then(
      (res) => res.json(),
    ),
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeed: (state) => {
      state.posts = [];
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserFeed.fulfilled, (state, action) => {
      if (action.payload) {
        state.posts = action.payload;
        state.status = 'success';
      }
    });
    builder.addCase(fetchUserFeed.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchUserFeed.rejected, (state) => {
      state.status = 'error';
    });
  },
});

export const { clearFeed } = feedSlice.actions;

export default feedSlice.reducer;
