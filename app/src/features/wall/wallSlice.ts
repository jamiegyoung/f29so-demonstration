// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { RootState } from "../../app/store";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Wall, WallState, FetchStatus, Pixel } from '../../types';

const initialState: WallState = {
  id: null,
  wall: null,
  status: 'idle',
  currentColor: '#FFFFFF',
  editingPixel: null,
};

export const wallSlice = createSlice({
  name: 'wall',
  initialState,
  reducers: {
    setEditingPixel: (state, action: PayloadAction<Pixel>) => {
      state.editingPixel = action.payload;
    },
    clearEditingPixel: (state) => {
      state.editingPixel = null;
    },
    setCurrentColor: (state, action: PayloadAction<string>) => {
      state.currentColor = action.payload;
    },
    setWallID: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    setWall: (state, action: PayloadAction<Wall>) => {
      state.wall = action.payload;
      state.id = action.payload.wallID;
    },
    setWallStatus: (state, action: PayloadAction<FetchStatus>) => {
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
          console.log('new history', history);
          pixel.history = [...history, ...pixel.history];
        }
      }
      // else, they are trying to make a request to a pixel that doesn't exist
    },
    // clears the wall from the state
    clearWall: (state) => {
      state.id = null;
      state.wall = null;
      state.status = 'idle';
      state.editingPixel = null;
    },
  },
});

export const {
  setEditingPixel,
  clearEditingPixel,
  setCurrentColor,
  setWallID,
  setWall,
  setWallStatus,
  setPixel,
  clearWall,
} = wallSlice.actions;

export default wallSlice.reducer;
