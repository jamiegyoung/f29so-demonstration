export type History = {
  userId: number;
  timestamp: string;
  color: string;
};

export type Pixel = {
  x: number;
  y: number;
  color: string;
  history: History[];
};

export type Wall = {
  wallID: number;
  owner: string;
  width: number;
  height: number;
  pixels: Pixel[];
};

export type WallState = {
  wall: Wall | null;
  /*
   * idle is the default state
   * pending is when the thunk is dispatched
   * success is when the thunk has successfully returned a wall
   * failure is when the thunk has failed
   */
  status: 'idle' | 'pending' | 'error' | 'success';
};
