import { Wall, Pixel } from '../../types';

export const fetchWallById = async (wallId: number): Promise<Wall> => {
  const response = await fetch(`/api/wall/${wallId}`);
  const wall = await response.json();
  return {
    ...wall,
  };
};

export async function setWallPixelById(
  wallId: number,
  pixel: Pixel,
): Promise<Wall> {
  const response = await fetch(`/api/wall/${wallId}/pixel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pixel),
  });
  const wall = await response.json();
  return {
    id: wall.wallId,
    wallName: wall.wallName,
    width: wall.width,
    height: wall.height,
    pixels: wall.pixels,
  };
}
