// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { RootState } from "../../app/store";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Wall, Pixel, WallState, WallStatus } from '../../types';

const initialState: WallState = {
  wall: null,
  status: 'idle',
};

export const wallSlice = createSlice({
  name: 'wall',
  initialState,
  reducers: {
    setWall: (state, action: PayloadAction<Wall>) => {
      state.wall = action.payload;
    },
    setWallStatus: (state, action: PayloadAction<WallStatus>) => {
      state.status = action.payload;
    },
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
          pixel.history = [...history];
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
});

export const { setWall, setWallStatus, setPixel, clearWall } =
  wallSlice.actions;

export default wallSlice.reducer;
