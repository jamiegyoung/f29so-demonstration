import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchWall } from './wallSlice';

import { WallState } from '../../types';

type WallProps = {
  wallID: number;
};

const WIDTH_PERCENT = 0.85;

function Wall({ wallID }: WallProps) {
  const dispatch = useAppDispatch();
  const selector = useAppSelector((state) => state.wall);

  const [wallData, setWallData] = useState<WallState>({
    wall: null,
    status: 'idle',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!wallData.wall) return;
    const { width, height, pixels } = wallData.wall;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    canvas.width = (window.innerWidth / width) * WIDTH_PERCENT;
    canvas.height = canvas.width * (height / width);
    const pixelSize = canvas.width / width;
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    pixels.forEach((pixel) => {
      context.fillStyle = pixel.color;
      context.fillRect(
        pixel.x * pixelSize,
        pixel.y * pixelSize,
        pixelSize,
        pixelSize,
      );
    });
  }, [wallData, canvasRef]);

  // when the wall id changes, fetch the wall
  useEffect(() => {
    const fetchData = () => dispatch(fetchWall(wallID));
    fetchData();
  }, [wallID]);

  // set wallData when wall changes
  useEffect(() => {
    setWallData(selector);
  }, [selector]);

  return wallData.status === 'success' ? (
    <canvas ref={canvasRef} />
  ) : (
    <h1>
      {wallData.status} Wall {wallID}
    </h1>
  );
}

export default Wall;
