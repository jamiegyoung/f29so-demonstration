export type History = {
  userId: number;
  timestamp: string;
  color: string;
};

export interface LocalPixel {
  x: number;
  y: number;
  color: string;
}

export interface Pixel extends LocalPixel {
  history: History[];
}

export type Wall = {
  wallID: number;
  owner: string;
  width: number;
  height: number;
  pixels: Pixel[] | LocalPixel[];
};

export type WallStatus = 'success' | 'idle' | 'loading' | 'error';

export type WallState = {
  id: number | null;
  wall: Wall | null;
  /*
   * idle is the default state
   * pending is when the thunk is dispatched
   * success is when the thunk has successfully returned a wall
   * failure is when the thunk has failed
   */
  status: WallStatus;
  currentColor: string;
  editingPixel: LocalPixel | Pixel | null;
};
