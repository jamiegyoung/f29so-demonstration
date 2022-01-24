import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchWall } from './wallSlice';

import { WallState, Wall as WallType, Pixel } from '../../types';

type WallProps = {
  wallID: number;
};

type MouseCoordinates = {
  x: number;
  y: number;
};

const WIDTH_PERCENT = 0.85;

function Wall({ wallID }: WallProps) {
  const dispatch = useAppDispatch();
  const selector = useAppSelector((state) => state.wall);

  const [wallData, setWallData] = useState<WallState>({
    wall: null,
    status: 'idle',
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const hoveringPixelRef = useRef<Pixel | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getMouseCoordinates = (
    event: MouseEvent,
    wall: WallType,
  ): MouseCoordinates => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = Math.floor(
      ((event.clientX - rect.left) / rect.width) * wall.width,
    );
    const y = Math.floor(
      ((event.clientY - rect.top) / rect.height) * wall.height,
    );
    return { x, y };
  };

  const handleCanvasHover = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!wallData.wall || !canvas) return;

    const { x, y } = getMouseCoordinates(event, wallData.wall);

    const pixel = wallData.wall.pixels.find((px) => px.x === x && px.y === y);
    if (pixel) hoveringPixelRef.current = pixel;
  };

  const draw = (
    ctx: CanvasRenderingContext2D,
    pixelSize: number,
    wall: WallType,
  ): void => {
    const context = ctx;

    const drawBorder = ({ x, y }: Pixel) => {
      context.strokeStyle = '#FFF';
      context.lineWidth = 2;
      context.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    };

    const drawMagnifyingGlass = ({ x, y, color }: Pixel) => {
      context.shadowColor = '#000000';
      context.shadowBlur = 20;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.fillRect(
        x * pixelSize + pixelSize,
        y * pixelSize + pixelSize,
        pixelSize * 4,
        pixelSize * 4,
      );
      context.strokeRect(
        x * pixelSize + pixelSize,
        y * pixelSize + pixelSize,
        pixelSize * 4,
        pixelSize * 4,
      );
      context.fillStyle = '#FFFFFF';
      context.font = `bold ${0.8 * pixelSize}px monospace`;
      context.fillText(
        `(${x}, ${y})`,
        x * pixelSize + pixelSize * 1.1,
        y * pixelSize + pixelSize * 2.5,
      );
      context.fillText(
        `${color}`,
        x * pixelSize + pixelSize * 1.3,
        y * pixelSize + pixelSize * 4,
      );
      ctx.beginPath();
      ctx.moveTo(x * pixelSize + pixelSize, y * pixelSize);
      ctx.lineTo(x * pixelSize + pixelSize * 5, y * pixelSize + pixelSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x * pixelSize, y * pixelSize + pixelSize);
      ctx.lineTo(x * pixelSize + pixelSize, y * pixelSize + pixelSize * 5);
      ctx.stroke();
    };

    context.fillStyle = '#000000';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    wall.pixels.forEach((pixel: Pixel) => {
      // check if the pixel is the one we're hovering over
      context.fillStyle = pixel.color;
      context.fillRect(
        pixel.x * pixelSize,
        pixel.y * pixelSize,
        pixelSize,
        pixelSize,
      );
    });

    if (hoveringPixelRef.current) {
      const hoveringPixel = hoveringPixelRef.current;
      context.fillStyle = hoveringPixel.color;
      // draw border around the hovering pixel
      drawBorder(hoveringPixel);
      drawMagnifyingGlass(hoveringPixel);
    }
  };

  // Generate a new wall when the data is received
  useEffect(() => {
    if (!wallData.wall) return;
    const { wall } = wallData;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const render = () => {
      const setCanvasProperties = () => {
        if (window.innerWidth < window.innerHeight) {
          canvas.width = window.innerWidth * WIDTH_PERCENT;
          canvas.height = canvas.width * (wall.height / wall.width);
          return;
        }
        canvas.height = window.innerHeight * WIDTH_PERCENT;
        canvas.width = canvas.height * (wall.width / wall.height);
      };
      setCanvasProperties();
      const pixelSize = canvas.width / wall.width;
      draw(ctx, pixelSize, wall);
      window.requestAnimationFrame(render);
    };

    render();
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
    <canvas
      onMouseMove={handleCanvasHover}
      // onClick={handleCanvasClick}
      ref={canvasRef}
    />
  ) : (
    <h1>
      {wallData.status} Wall {wallID}
    </h1>
  );
}

export default Wall;
