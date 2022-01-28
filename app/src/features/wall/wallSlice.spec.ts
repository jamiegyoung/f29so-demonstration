import wallReducer, {
  setCurrentColor,
  setWallID,
  setPixel,
  setEditingPixel,
  clearWall,
} from './wallSlice';
import { LocalPixel, WallState } from '../../types';

describe('wall reducer', () => {

  const newPixel: LocalPixel = {
    x: 0,
    y: 0,
    color: '#000000',
  };

  const initialState: WallState = {
    id: 1,
    wall: {
      wallID: 3,
      owner: "bob's wall",
      width: 32,
      height: 32,
      pixels: [
        {
          x: 0,
          y: 0,
          color: '#FFFFFF',
        },
      ],
    },
    status: 'success',
    currentColor: '#FFFFFF',
    editingPixel: newPixel,
  };

  it('should handle initial state', () => {
    expect(wallReducer(undefined, { type: 'unknown' })).toEqual({
      id: null,
      wall: null,
      status: 'idle',
      currentColor: '#FFFFFF',
      editingPixel: null,
    });
  });
  it('should be able to set the current editing pixel', () => {
    expect(wallReducer(initialState, setEditingPixel(newPixel))).toEqual({
      ...initialState,
      editingPixel: newPixel,
    });
  });
  it('should be able to set the current color', () => {
    expect(wallReducer(initialState, setCurrentColor('#000000'))).toEqual({
      ...initialState,
      currentColor: '#000000',
    });
  });
  it('should be able to set the id', () => {
    const actual = wallReducer(initialState, setWallID(3));
    expect(actual.id).toEqual(3);
  });
  it('should be able to set a pixel', () => {
    const actual = wallReducer(initialState, setPixel(newPixel));

    expect(actual).toEqual({
      ...initialState,
      wall: {
        ...initialState.wall,
        pixels: [
          {
            ...newPixel,
          },
        ],
      },
      status: 'success',
    });
  });
  it('should be able to clear the wall', () => {
    const actual = wallReducer(initialState, clearWall());

    expect(actual).toEqual({
      id: null,
      wall: null,
      status: 'idle',
      currentColor: '#FFFFFF',
      editingPixel: null,
    });
  });
});
