import Jimp from 'jimp';
import hexRgb from 'hex-rgb';

export default function genPreviewBuffer(width, height, pixels) {
  const previewArr = Array.from(Array(height), () =>
    Array(width).fill('#000000'),
  );

  pixels.forEach((px) => {
    previewArr[px.y][px.x] = px.color;
  });

  const image = new Jimp(width, height, 0xffc0cbff, () => null);

  if (image === null) {
    return null;
  }

  pixels.forEach((px) => {
    const rgb = hexRgb(px.color);
    image.setPixelColor(
      Jimp.rgbaToInt(rgb.red, rgb.green, rgb.blue, 255),
      px.x,
      px.y,
    );
  });

  try {
    return image.getBufferAsync(Jimp.MIME_PNG);
  } catch (error) {
    return null;
  }
}
