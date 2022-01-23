// IMPORTS
const pngjs = require('pngjs');

const fs = require('fs'); // temp

/**
 * Generate a PNG version of a WALL
 * @param {JSON} pixelArray
 * @param {number} width
 * @param {number} height
 * @returns {Buffer} PNG file
 */
function genPreview(pixelArray, width, height) {
  // Create PNG (pngjs)
  const image = new pngjs.PNG();
  image.width = width;
  image.height = height;

  // Init buffer
  const dataBuf = Buffer.alloc(width * height * 4);

  // Copy image into buffer
  pixelArray.forEach((pixel) => {
    // for (var i=0; i<4; i++) {
    // dataBuf[(pixel.y * width + pixel.x) * 4 + i] = parseInt(pixel.color.substr(i * 2, 2));
    // }

    const x = pixel.x;
    const y = pixel.y;
    const c = pixel.color;

    const r = parseInt(c.substr(0, 2), 16);
    const g = parseInt(c.substr(2, 2), 16);
    const b = parseInt(c.substr(4, 2), 16);
    const a = parseInt(c.substr(6, 2), 16);

    dataBuf[(y * width + x) * 4 + 0] = r;
    dataBuf[(y * width + x) * 4 + 1] = g;
    dataBuf[(y * width + x) * 4 + 2] = b;
    dataBuf[(y * width + x) * 4 + 3] = a;
  });
  image.data = dataBuf;

  // Create PNF "file"
  const fileBuf = pngjs.PNG.sync.write(image);
  fs.writeFileSync('test.png', fileBuf);

  return fileBuf;
}
exports.genPreview = genPreview;
