import Jimp from 'jimp';
import hexRgb from 'hex-rgb';
import Debug from 'debug';

const debug = Debug('genPreview');

export default function genPreviewBuffer(width, height, pixels) {
  const previewArr = Array.from(Array(height), () =>
    Array(width).fill('#000000'),
  );

  pixels.forEach((px) => {
    previewArr[px.y][px.x] = px.color;
  });

  const image = new Jimp(32, 32, 0xffc0cbff, (err) => {
    if (err) throw err;
  });

  pixels.forEach((px) => {
    const rgb = hexRgb(px.color);
    image.setPixelColor(
      Jimp.rgbaToInt(rgb.red, rgb.green, rgb.blue, 255),
      px.x,
      px.y,
    );
  });

  return image.getBufferAsync(Jimp.MIME_PNG);
}
