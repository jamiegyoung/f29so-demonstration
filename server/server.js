// CONSTANTS
const port = 2000;
const apiVersionString = 'v1';

// CALCULATED CONSTANTS

const urlPrefix = `/api/${apiVersionString}`;

// IMPORTS
const express = require('express');

const app = express();
const server = require('http').Server(app);
const path = require('path');

// const pngjs = require('pngjs');
const debug = require('debug')('server');
const db = require('./db');
const { genPreview } = require('./preview-gen');

// EXPRESS STUFF

app.use('/static', express.static(path.join(__dirname, './static/')));

app.get(`${urlPrefix}/get-canvas/:canvasId`, (req, res) => {
  const { canvasId } = req.params;

  const data = db.getCanvasMetadata(canvasId);
  const pixels = db.getCanvasPixels(canvasId);

  if (!data) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Canvas does not exist');
    return;
  }

  data.Pixels = pixels;

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
});

app.get(`${urlPrefix}/create-canvas/:owner/:width/:height`, (req, res) => {
  // TODO: add validation
  // const succ = db.createCanvas(
  //   req.params.owner,
  //   req.params.width,
  //   req.params.height,
  // );

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('done');
});

app.get(`${urlPrefix}/get-pixel/:canvasId/:x/:y`, (req, res) => {
  const { canvasId } = req.params;
  const x = parseInt(req.params.x, 10);
  const y = parseInt(req.params.y, 10);

  const meta = db.getCanvasMetadata(canvasId);

  // Verify coordinates are within the canvas
  if (x < 0 || x >= meta.Width || y < 0 || y >= meta.Height) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid coordinates');
    return;
  }

  const pixel = db.getPixel(canvasId, x, y);

  if (pixel) {
    // Write coordinates back
    pixel.x = x;
    pixel.y = y;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(pixel));
  } else {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Pixel does not exist');
  }
});

app.get(`${urlPrefix}/set-pixel/:canvasId/:x/:y/:color/:user`, (req, res) => {
  const { canvasId } = req.params;
  const x = parseInt(req.params.x, 10);
  const y = parseInt(req.params.y, 10);
  let { color } = req.params;

  const meta = db.getCanvasMetadata(canvasId);

  // Verify coordinates are within the canvas
  if (x < 0 || x >= meta.Width || y < 0 || y >= meta.Height) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid coordinates');
    return;
  }

  color = color.toString(); // Just to make sure

  if (color.length !== 8) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid colour format');
    return;
  }

  db.setPixel(canvasId, x, y, color, req.params.user);

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('done');
});

app.get(`${urlPrefix}/get-preview/:canvasId`, (req, res) => {
  const pre = db.getCanvasPreview(req.params.canvasId);

  if (pre) {
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(pre);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Preview not found');
  }
});

// INIT

server.listen(port);
debug(`Started server on port ${port}`);

db.init();

// OTHER FUNCTIONS

/**
 * Generate preview PNGs for all canvases
 */
function genPreviews() {
  const canvasIds = db.getAllCanvasIDs();
  debug('Generating previews for %d canvases', canvasIds.length);
  debug(canvasIds);

  debug('Started generating previews...');
  canvasIds.forEach((canvasId) => {
    debug(`Preview for ID ${canvasId}`);

    const meta = db.getCanvasMetadata(canvasId);
    const pixels = db.getCanvasPixels(canvasId);

    const preview = genPreview(pixels, meta.Width, meta.Height);

    // fs.writeFileSync(`previews/${canvasId}.png`, preview); // test

    db.setCanvasPreview(canvasId, preview);
  });
  debug('Done generating previews');
}

// TEST STUFF
// genPreview(db.getCanvasPixels(1), 4, 2);

genPreviews();
