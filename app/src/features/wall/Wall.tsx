import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setPixel, setWall, setWallStatus } from './wallSlice';
import { WallState, Wall as WallType, Pixel } from '../../types';
import Spinner from '../../components/Spinner';
import useSocket from '../../hooks/useSocket';
import useServerUrl from '../../hooks/useServerURL';

type WallProps = {
  wallID: number;
};

type MouseCoordinates = {
  x: number;
  y: number;
};

const CANVAS_SIZE_PERCENT = 0.85;

function Wall({ wallID }: WallProps) {
  const dispatch = useAppDispatch();
  const wallSelector = useAppSelector((state) => state.wall);
  const requestRef = useRef<number>(-1);
  // const apiUrl = useApiUrl();

  const [wallData, setWallData] = useState<WallState>({
    wall: null,
    status: 'idle',
  });

  // convert to useSocket
  const [socket, setSocket] = useSocket();

  useEffect(() => {
    setSocket({
      uri: `${useServerUrl()}/walls`,
      opts: {
        query: {
          wall: wallID,
        },
      },
    });
  }, [setSocket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('connected', (data: WallType) => {
      dispatch(setWall(data));
      dispatch(setWallStatus('success'));
    });

    socket.on('error', (err) => {
      // TODO: handle socket errors
      console.log('error', err);
      dispatch(setWallStatus('error'));
    });

    socket.on('pixel-edit', (data: Pixel) => {
      dispatch(setPixel(data));
    });
  }, [socket]);

  const hoveringPixelRef = useRef<Pixel | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getMouseCoordinates = (
    event: MouseEvent,
    wall: WallType,
  ): MouseCoordinates => {
    // Get the mouse coordinates relative to the canvas
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

    // get the pixel at the mouse coordinates and set it as the hovering pixel
    const pixel = wallData.wall.pixels.find((px) => px.x === x && px.y === y);
    if (pixel) hoveringPixelRef.current = pixel;
  };

  const handleCanvasClick = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!wallData.wall || !canvas) return;

    const { x, y } = getMouseCoordinates(event, wallData.wall);
    const pixel = wallData.wall.pixels.find((px) => px.x === x && px.y === y);
    if (socket && pixel) {
      const testPixel = { ...pixel, color: '#FFC0CB' };
      socket.emit('pixel-edit', testPixel);
    }
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
      const calcMagnifyingGlassOffset = () => {
        let offsetX = 1.5;
        let offsetY = 1.5;
        if (x >= wall.width / 2) {
          offsetX = -4.5;
        }
        if (y >= wall.height / 2) {
          offsetY = -4.5;
        }
        return { x: offsetX, y: offsetY };
      };

      const magnifyingGlassOffset = calcMagnifyingGlassOffset();

      const calcPixelWithOffset = {
        x: pixelSize * magnifyingGlassOffset.x,
        y: pixelSize * magnifyingGlassOffset.y,
      };

      context.shadowColor = '#000000';
      context.shadowBlur = 20;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;

      ctx.beginPath();
      ctx.moveTo(x * pixelSize + pixelSize, y * pixelSize);
      ctx.lineTo(
        x * pixelSize + calcPixelWithOffset.x + pixelSize * 4,
        y * pixelSize + calcPixelWithOffset.y,
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x * pixelSize, y * pixelSize + pixelSize);
      ctx.lineTo(
        x * pixelSize + calcPixelWithOffset.x,
        y * pixelSize + calcPixelWithOffset.y + pixelSize * 4,
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x * pixelSize, y * pixelSize);
      ctx.lineTo(
        x * pixelSize + calcPixelWithOffset.x,
        y * pixelSize + calcPixelWithOffset.y,
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x * pixelSize + pixelSize, y * pixelSize + pixelSize);
      ctx.lineTo(
        x * pixelSize + calcPixelWithOffset.x + pixelSize * 4,
        y * pixelSize + calcPixelWithOffset.y + pixelSize * 4,
      );
      ctx.stroke();

      context.fillRect(
        x * pixelSize + calcPixelWithOffset.x,
        y * pixelSize + calcPixelWithOffset.y,
        pixelSize * 4,
        pixelSize * 4,
      );
      context.strokeRect(
        x * pixelSize + calcPixelWithOffset.x,
        y * pixelSize + calcPixelWithOffset.y,
        pixelSize * 4,
        pixelSize * 4,
      );
      context.fillStyle = '#FFFFFF';
      context.font = `bold ${0.8 * pixelSize}px monospace`;
      context.textAlign = 'center';
      context.fillText(
        `(${x}, ${y})`,
        x * pixelSize + calcPixelWithOffset.x + pixelSize * 2,
        y * pixelSize + calcPixelWithOffset.y + pixelSize * 1.8,
      );
      context.fillText(
        `${color}`,
        x * pixelSize + calcPixelWithOffset.x + pixelSize * 2,
        y * pixelSize + calcPixelWithOffset.y + pixelSize * 3,
      );
    };

    const drawPixels = () => {
      wall.pixels.forEach((pixel: Pixel) => {
        // check if the pixel is the one we're hovering over
        context.fillStyle = pixel.color;
        context.fillRect(
          pixel.x * pixelSize,
          pixel.y * pixelSize,
          pixelSize,
          pixelSize,
        );
        context.strokeStyle = '#000';
        context.strokeRect(
          pixel.x * pixelSize,
          pixel.y * pixelSize,
          pixelSize,
          pixelSize,
        );
      });
    };

    context.fillStyle = '#000';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // draw the pixels
    drawPixels();

    // draw hovering effects
    if (hoveringPixelRef.current) {
      const hoveringPixel = hoveringPixelRef.current;
      context.fillStyle = hoveringPixel.color;
      // draw border around the hovering pixel
      drawBorder(hoveringPixel);
      drawMagnifyingGlass(hoveringPixel);
    }
  };

  // Generate a new wall when the data is received
  const render = () => {
    if (!wallData.wall) return;
    const { wall } = wallData;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    // calculates the canvas size TODO: fix for non-square walls
    const setCanvasProperties = () => {
      canvas.width = window.innerWidth * CANVAS_SIZE_PERCENT;
      canvas.height = canvas.width * (wall.height / wall.width);
      if (canvas.height > window.innerHeight * CANVAS_SIZE_PERCENT) {
        canvas.height = window.innerHeight * CANVAS_SIZE_PERCENT;
        canvas.width = canvas.height * (wall.width / wall.height);
      }
    };

    setCanvasProperties();

    const pixelSize = canvas.width / wall.width;
    // starts drawing the canvas
    draw(ctx, pixelSize, wall);
    requestRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(requestRef.current);
  }, [wallData]);

  // set wallData when wall changes
  useEffect(() => {
    setWallData(wallSelector);
  }, [wallSelector]);

  return wallData.status === 'success' ? (
    <canvas
      onMouseMove={handleCanvasHover}
      onMouseOut={() => {
        hoveringPixelRef.current = null;
      }}
      onBlur={() => {
        hoveringPixelRef.current = null;
      }}
      onClick={handleCanvasClick}
      ref={canvasRef}
    />
  ) : (
    <Spinner />
  );
}

export default Wall;
