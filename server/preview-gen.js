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
	let image = new pngjs.PNG();
	image.width = width;
	image.height = height;

	// Init buffer
	let dataBuf = Buffer.alloc(width * height * 4);

	// Copy image into buffer
	for (p in pixelArray) {
		let pixel = pixelArray[p];

		// for (var i=0; i<4; i++) {
		// 	dataBuf[(pixel.Y * width + pixel.X) * 4 + i] = parseInt(pixel.Colour.substr(i * 2, 2));
		// }

		let x = pixel.X;
		let y = pixel.Y;
		let c = pixel.Colour;

		let r = parseInt(c.substr(0, 2), 16);
		let g = parseInt(c.substr(2, 2), 16);
		let b = parseInt(c.substr(4, 2), 16);
		let a = parseInt(c.substr(6, 2), 16);

		dataBuf[(y * width + x) * 4 + 0] = r;
		dataBuf[(y * width + x) * 4 + 1] = g;
		dataBuf[(y * width + x) * 4 + 2] = b;
		dataBuf[(y * width + x) * 4 + 3] = a;
	}
	image.data = dataBuf;

	// Create PNF "file"
	var fileBuf = pngjs.PNG.sync.write(image);
	fs.writeFileSync('test.png', fileBuf);

	return fileBuf;
}
exports.genPreview = genPreview;
