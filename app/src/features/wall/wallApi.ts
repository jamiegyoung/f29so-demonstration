import { Wall, Pixel } from '../../types';

const getApiUrl = (): string => {
  if (process.env.NODE_ENV === 'development')
    return process.env.DEV_API_ADDRESS || 'http://localhost:2000/api/v1';
  return process.env.API_ADDRESS || '/api/v1';
};

export const fetchWallById = (wallID: number): Promise<Wall> =>
  new Promise((resolve, reject) => {
    fetch(`${getApiUrl()}/get-wall/${wallID}`).then((res) => {
      if (res.status === 200) {
        resolve(res.json());
      }
      reject(res.statusText);
    });
  });

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
    wallID: wall.wallID,
    owner: wall.owner,
    width: wall.width,
    height: wall.height,
    pixels: wall.pixels,
  };
}
