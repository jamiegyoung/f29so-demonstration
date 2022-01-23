import { Wall, Pixel } from '../../types';

export const fetchWallById = async (wallID: number): Promise<Wall> => {
  const response = await fetch(`/api/wall/${wallID}`);
  const wall = await response.json();
  return {
    ...wall,
  };
};

export async function setWallPixelById(
  wallID: number,
  pixel: Pixel,
): Promise<Wall> {
  const response = await fetch(`/api/wall/${wallID}/pixel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pixel),
  });
  const wall = await response.json();
  return {
    id: wall.wallID,
    owner: wall.wallName,
    width: wall.width,
    height: wall.height,
    pixels: wall.pixels,
  };
}
