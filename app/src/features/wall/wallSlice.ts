// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { RootState } from "../../app/store";
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Wall, Pixel } from '../../types';
import { fetchWallById, setWallPixelById } from './wallApi';

const initialState: Wall = {
  id: null,
  wallName: null,
  width: null,
  height: null,
  pixels: [],
};

export const fetchWall = createAsyncThunk(
  'wall/fetchWall',
  async (wallId: number): Promise<Wall> => fetchWallById(wallId),
);

type SetPixelInfo = {
  wallId: number;
  pixel: Pixel;
};

export const setWallPixel = createAsyncThunk(
  'wall/setWallPixel',
  async ({ wallId, pixel }: SetPixelInfo): Promise<Wall> =>
    setWallPixelById(wallId, pixel),
);

export const wallSlice = createSlice({
  name: 'wall',
  initialState,
  reducers: {
    // sets a single pixel in the wall
    setPixel: (state, action: PayloadAction<Pixel>) => {
      const { x, y, color, history } = action.payload;
      // check there is a width and height and see if the pixel is within the wall
      if (state.width && state.height && state.width > x && state.height > y) {
        const pixel = state.pixels.find((p) => p.x === x && p.y === y);
        if (pixel) {
          pixel.color = color;
          pixel.history = [...history, ...pixel.history];
        }
      }
      // else, they are trying to make a request to a pixel that doesn't exist
    },
    // clears the wall from the state
    clearWall: (state) => {
      state.id = null;
      state.wallName = null;
      state.width = null;
      state.height = null;
      state.pixels = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchWall.fulfilled,
      (state, action: PayloadAction<Wall>) => {
        // set state to the action
        const { id: wallId, wallName, width, height, pixels } = action.payload;
        state.id = wallId;
        state.wallName = wallName;
        state.width = width;
        state.height = height;
        state.pixels = pixels;
      },
    );
  },
});

export const { setPixel, clearWall } = wallSlice.actions;

export default wallSlice.reducer;
