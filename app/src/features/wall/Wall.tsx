import { MouseEvent, useEffect, useRef } from 'react';
import { hex } from 'wcag-contrast';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setEditingPixel } from './wallSlice';
import { Wall as WallType, LocalPixel } from '../../types';
import Spinner from '../../components/Spinner';

type MouseCoordinates = {
  x: number;
  y: number;
};

const CANVAS_SIZE_PERCENT = 0.75;

function Wall() {
  const dispatch = useAppDispatch();
  const wallData = useAppSelector((state) => state.wall.wall);
  const requestRef = useRef<number>(-1);
  // const apiUrl = useApiUrl();

  // const [wallData, setWallData] = useState<WallState>({
  //   id: null,
  //   wall: null,
  //   status: 'idle',
  //   currentColor: '#000000',
  //   editingPixel: null,
  // });

  const hoveringPixelRef = useRef<LocalPixel | null>(null);

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
    if (!wallData || !canvas) return;

    const { x, y } = getMouseCoordinates(event, wallData);

    // get the pixel at the mouse coordinates and set it as the hovering pixel
    const pixel = wallData.pixels.find((px) => px.x === x && px.y === y);
    if (pixel) hoveringPixelRef.current = pixel;
  };

  const handleCanvasClick = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!wallData || !canvas) return;

    const { x, y } = getMouseCoordinates(event, wallData);
    const pixel = wallData.pixels.find((px) => px.x === x && px.y === y);
    if (pixel) {
      dispatch(setEditingPixel(pixel));
    }
  };

  const draw = (
    ctx: CanvasRenderingContext2D,
    pixelSize: number,
    wall: WallType,
  ): void => {
    const context = ctx;

    const drawBorder = ({ x, y }: LocalPixel) => {
      context.strokeStyle = '#FFF';
      context.lineWidth = 2;
      context.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    };

    const drawMagnifyingGlass = ({ x, y, color }: LocalPixel) => {
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
      const calcTextColor = () => {
        if (hex(color, '#000000') < 4.5) {
          return '#FFF';
        }
        return '#000';
      }

      context.fillStyle = calcTextColor();
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
      wall.pixels.forEach((pixel: LocalPixel) => {
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
    if (!wallData) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    // calculates the canvas size TODO: fix for non-square walls
    const setCanvasProperties = () => {
      canvas.width = window.innerWidth * CANVAS_SIZE_PERCENT;
      canvas.height = canvas.width * (wallData.height / wallData.width);
      if (canvas.height > window.innerHeight * CANVAS_SIZE_PERCENT) {
        canvas.height = window.innerHeight * CANVAS_SIZE_PERCENT;
        canvas.width = canvas.height * (wallData.width / wallData.height);
      }
    };

    setCanvasProperties();

    const pixelSize = canvas.width / wallData.width;
    // starts drawing the canvas
    draw(ctx, pixelSize, wallData);
    requestRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(requestRef.current);
  }, [wallData]);

  return wallData ? (
    <canvas
      style={{
        border: `1px solid #fff`,
        borderRadius: '10px',
      }}
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
