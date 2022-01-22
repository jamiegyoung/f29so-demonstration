export type Pixel = {
  x: number;
  y: number;
  color: string;
  history: History[];
};

export type Wall = {
  id: number | null;
  wallName: string | null;
  width: number | null;
  height: number | null;
  pixels: Pixel[];
};

export type History = {
  userId: number;
  timestamp: string;
  color: string;
};
