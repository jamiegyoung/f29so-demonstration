// CONSTANTS

const server_port = 2000;
const api_version_string = 'v1';


// CALCULATED CONSTANTS

const url_prefix = `/api/${api_version_string}`;


// IMPORTS

const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');
const fs = require('fs');

const db = require('./db.js');
const { genPreview } = require('./preview-gen.js');

const pngjs = require('pngjs');


// EXPRESS STUFF

app.use('/static', express.static(path.join(__dirname, './static/')));

app.get(`${url_prefix}/get-canvas/:cid`, (req, res) => {
	let cid = req.params.cid;

	let data = db.getCanvasMetadata(cid);
	let pixels = db.getCanvasPixels(cid);

	if (!data) {
		res.writeHead(400, {'Content-Type': 'text/plain'});
		res.end("Canvas does not exist");
		return;
	}

	data['Pixels'] = pixels;

	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(data));
});

app.get(`${url_prefix}/create-canvas/:owner/:width/:height`, (req, res) => {
	// TODO: add validation
	let succ = db.createCanvas(req.params.owner, req.params.width, req.params.height);

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end("done");
});

app.get(`${url_prefix}/get-pixel/:cid/:x/:y`, (req, res) => {
	let cid = req.params.cid;
	let x = parseInt(req.params.x);
	let y = parseInt(req.params.y);

	let meta = db.getCanvasMetadata(cid);

	// Verify coordinates are within the canvas
	if (x < 0 || x >= meta.Width || y < 0 || y >= meta.Height) {
		res.writeHead(400, {'Content-Type': 'text/plain'});
		res.end("Invalid coordinates");
		return;
	}

	let pixel = db.getPixel(cid, x, y);

	if (pixel) {
		// Write coordinates back
		pixel['x'] = x;
		pixel['y'] = y;

		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(pixel));
	} else {
		res.writeHead(500, {'Content-Type': 'text/plain'});
		res.end("Pixel does not exist");
	}
});

app.get(`${url_prefix}/set-pixel/:cid/:x/:y/:col/:user`, (req, res) => {
	let cid = req.params.cid;
	let x = parseInt(req.params.x);
	let y = parseInt(req.params.y);
	var col = req.params.col;

	let meta = db.getCanvasMetadata(cid);

	// Verify coordinates are within the canvas
	if (x < 0 || x >= meta.Width || y < 0 || y >= meta.Height) {
		res.writeHead(400, {'Content-Type': 'text/plain'});
		res.end("Invalid coordinates");
		return;
	}

	col = col.toString(); // Just to make sure

	if (col.length != 8) {
		res.writeHead(400, {'Content-Type': 'text/plain'});
		res.end("Invalid colour format");
		return;
	}

	db.setPixel(cid, x, y, col, req.params.user);

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end("done");
});

app.get(`${url_prefix}/get-preview/:cid`, (req, res) => {
	let pre = db.getCanvasPreview(req.params.cid);

	if (pre) {
		res.writeHead(200, {'Content-Type': 'image/png'});
		res.end(pre);
	}
	else {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end("Preview not found");
	}
});


// INIT

server.listen(server_port);
console.log(`Started server on port ${server_port}`);

db.init();


// OTHER FUNCTIONS

/**
 * Generate preview PNGs for all canvases
 */
function genPreviews() {
	let cids = db.getAllCanvasIDs();

	console.debug("Started generating previews...");
	for (asdf in cids) {
		let cid = cids[asdf];
		console.debug("Preview for ID " + cid);

		let meta = db.getCanvasMetadata(cid);
		let pixels = db.getCanvasPixels(cid);

		let preview = genPreview(pixels, meta.Width, meta.Height);

		//fs.writeFileSync(`previews/${cid}.png`, preview); // test

		db.setCanvasPreview(cid, preview);
	}
	console.debug("Done generating previews");
}


// TEST STUFF
//genPreview(db.getCanvasPixels(1), 4, 2);

genPreviews();
