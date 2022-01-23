// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { RootState } from "../../app/store";
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Wall, Pixel, WallState } from '../../types';
import { fetchWallById, setWallPixelById } from './wallApi';

const initialState: WallState = {
  wall: null,
  status: 'idle',
};

export const fetchWall = createAsyncThunk(
  'wall/fetchWall',
  async (wallID: number): Promise<Wall> => fetchWallById(wallID),
);

type SetPixelInfo = {
  wallID: number;
  pixel: Pixel;
};

export const setWallPixel = createAsyncThunk(
  'wall/setWallPixel',
  async ({ wallID, pixel }: SetPixelInfo): Promise<Wall> =>
    setWallPixelById(wallID, pixel),
);

export const wallSlice = createSlice({
  name: 'wall',
  initialState,
  reducers: {
    // sets a single pixel in the wall
    setPixel: (state, action: PayloadAction<Pixel>) => {
      const { x, y, color, history } = action.payload;
      // check there is a width and height and see if the pixel is within the wall
      if (
        state.wall &&
        state.wall.width &&
        state.wall.height &&
        state.wall.width > x &&
        state.wall.height > y
      ) {
        const pixel = state.wall.pixels.find((p) => p.x === x && p.y === y);
        if (pixel) {
          pixel.color = color;
          pixel.history = [...history, ...pixel.history];
        }
      }
      // else, they are trying to make a request to a pixel that doesn't exist
    },
    // clears the wall from the state
    clearWall: (state) => {
      state.wall = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchWall.fulfilled,
      (state, action: PayloadAction<Wall>) => {
        state.wall = action.payload;
        state.status = 'success';
      },
    );
    builder.addCase(fetchWall.rejected, (state) => {
      state.status = 'error';
    });
    builder.addCase(fetchWall.pending, (state) => {
      state.status = 'pending';
    });
  },
});

export const { setPixel, clearWall } = wallSlice.actions;

export default wallSlice.reducer;
