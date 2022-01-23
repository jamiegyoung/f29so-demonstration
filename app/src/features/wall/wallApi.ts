import { Wall, Pixel } from '../../types';
import 'dotenv/config';

const getApiUrl = (): string => {
  if (process.env.NODE_ENV === 'development')
    return process.env.DEV_API_ADDRESS || 'http://localhost:5000';
  return process.env.API_ADDRESS || '';
};

console.log("API_ADDRESS: ", getApiUrl());

export const fetchWallById = async (wallID: number): Promise<Wall> => {
  const response = await fetch(`${getApiUrl()}/wall/${wallID}`);
  const wall = await response.json();
  return {
    ...wall,
  };
};

export async function setWallPixelById(
  wallID: number,
  pixel: Pixel,
): Promise<Wall> {
  const response = await fetch(`${getApiUrl()}/${wallID}/pixel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pixel),
  });
  const wall = await response.json();
  return {
    id: wall.wallID,
    owner: wall.owner,
    width: wall.width,
    height: wall.height,
    pixels: wall.pixels,
  };
}
