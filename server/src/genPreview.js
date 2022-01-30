import Jimp from 'jimp';
import hexRgb from 'hex-rgb';
import Debug from 'debug';

const debug = Debug('genPreview');

function genBuffer(width, height, pixels) {
  const previewArr = Array.from(Array(height), () =>
    Array(width).fill('#000000'),
  );

  pixels.forEach((px) => {
    previewArr[px.y][px.x] = px.color;
  });
  // debug(previewArr);
  const saveImage = () =>
    new Jimp(32, 32, (err, image) => {
      if (err) throw err;
      // debug(previewImage);
      previewArr.forEach((row, y) => {
        row.forEach((color, x) => {
          const { red, green, blue } = hexRgb(color);
          const parsedColor = Jimp.rgbaToInt(red, green, blue, 255);
          image.setPixelColor(parsedColor, x, y);
        });
      });
      image.getBuffer(Jimp.MIME_PNG, (_err, buffer) => {
        if (_err) return undefined;
        return buffer;
      });
    });

  return saveImage().bitmap.data;
}

export default function genPreviewBuffer(width, height, pixels) {
  return genBuffer(width, height, pixels);
}
