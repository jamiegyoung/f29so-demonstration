import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import fetchApi from '../../app/fetchApi';
import { FeedState, SetLikeType, v1 } from '../../types';

const initialState: FeedState = {
  status: 'idle',
  posts: [],
};

type FetchUserFeedPayload = {
  page: number;
};

export const fetchUserFeed = createAsyncThunk(
  'feed/fetchUserFeed',
  async ({ page }: FetchUserFeedPayload) =>
    fetchApi(v1.routes.getFeed, { params: [page.toString(10)] }).then((res) =>
      res.json(),
    ),
);

export const fetchUserWallFeed = createAsyncThunk(
  'feed/fetchUserWallFeed',
  async ({ userID }: { userID: number }) =>
    fetchApi(v1.routes.getUserWalls, { params: [userID.toString(10)] }).then(
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
    setLikes: (state, action: PayloadAction<SetLikeType>) => {
      const { wallID, likes, liked } = action.payload;
      const post = state.posts.find((p) => p.wallID === wallID);
      if (post) {
        post.likes = likes;
        post.liked = liked;
      }
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
    builder.addCase(fetchUserWallFeed.fulfilled, (state, action) => {
      if (action.payload) {
        state.posts = action.payload;
        state.status = 'success';
      }
    });
    builder.addCase(fetchUserWallFeed.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchUserWallFeed.rejected, (state) => {
      state.status = 'error';
    });
  },
});

export const { clearFeed, setLikes } = feedSlice.actions;

export default feedSlice.reducer;
