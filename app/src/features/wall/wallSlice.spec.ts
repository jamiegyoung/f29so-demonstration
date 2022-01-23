import wallReducer, { setPixel, clearWall } from './wallSlice';

import { Pixel, Wall } from '../../types';

describe('wall reducer', () => {
  const initialHistory = [
    {
      userId: 1,
      timestamp: '2022-01-01T00:00:00.000Z',
      color: '#FFFFFF',
    },
  ];

  const initialState: Wall = {
    id: 3,
    owner: "bob's wall",
    width: 32,
    height: 32,
    pixels: [
      {
        x: 0,
        y: 0,
        color: '#FFFFFF',
        history: initialHistory,
      },
    ],
  };
  it('should handle initial state', () => {
    expect(wallReducer(undefined, { type: 'unknown' })).toEqual({
      id: null,
      owner: null,
      width: null,
      height: null,
      pixels: [],
    });
  });

  it('should be able to set a pixel', () => {
    const newPixel: Pixel = {
      x: 0,
      y: 0,
      color: '#000000',
      history: [
        {
          userId: 3,
          timestamp: '2022-01-02T00:00:00.000Z',
          color: '#000000',
        },
      ],
    };

    const actual = wallReducer(initialState, setPixel(newPixel));

    expect(actual).toEqual({
      ...initialState,
      pixels: [
        {
          ...newPixel,
          history: [...newPixel.history, ...initialHistory],
        },
      ],
    });
  });
  it('should be able to clear the wall', () => {
    const actual = wallReducer(initialState, clearWall());

    expect(actual).toEqual({
      id: null,
      owner: null,
      width: null,
      height: null,
      pixels: [],
    });
  });
});
