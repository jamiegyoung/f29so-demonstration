import useServerURL from '../../hooks/useServerURL';
import { Wall, Pixel } from '../../types';

const apiUrl = useServerURL();

export const fetchWallById = (wallID: number): Promise<Wall> =>
  new Promise((resolve, reject) => {
    fetch(`${apiUrl}/api/v1/get-wall/${wallID}`)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.json());
        }
        reject(res.statusText);
      })
      .catch((err) => reject(err));
  });

export async function setWallPixelById(
  wallID: number,
  pixel: Pixel,
): Promise<Wall> {
  const response = await fetch(`${apiUrl}/api/v1/${wallID}/pixel`, {
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
