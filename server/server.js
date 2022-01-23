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

app.get(`${urlPrefix}/get-wall/:wallId`, (req, res) => {
  const { wallId } = req.params;

  const data = db.getWallMetadata(wallId);
  const pixels = db.getWallPixels(wallId);

  if (!data) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Wall does not exist');
    return;
  }

  data.Pixels = pixels;

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
});

app.get(`${urlPrefix}/create-wall/:owner/:width/:height`, (req, res) => {
  // TODO: add validation
  // const succ = db.createWall(
  //   req.params.owner,
  //   req.params.width,
  //   req.params.height,
  // );

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('done');
});

app.get(`${urlPrefix}/get-pixel/:wallId/:x/:y`, (req, res) => {
  const { wallId } = req.params;
  const x = parseInt(req.params.x, 10);
  const y = parseInt(req.params.y, 10);

  const meta = db.getWallMetadata(wallId);

  // Verify coordinates are within the wall
  if (x < 0 || x >= meta.Width || y < 0 || y >= meta.Height) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid coordinates');
    return;
  }

  const pixel = db.getPixel(wallId, x, y);

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

app.get(`${urlPrefix}/set-pixel/:wallId/:x/:y/:color/:user`, (req, res) => {
  const { wallId } = req.params;
  const x = parseInt(req.params.x, 10);
  const y = parseInt(req.params.y, 10);
  let { color } = req.params;

  const meta = db.getWallMetadata(wallId);

  // Verify coordinates are within the wall
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

  db.setPixel(wallId, x, y, color, req.params.user);

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('done');
});

app.get(`${urlPrefix}/get-preview/:wallId`, (req, res) => {
  const pre = db.getWallPreview(req.params.wallId);

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
 * Generate preview PNGs for all walles
 */
function genPreviews() {
  const wallIds = db.getAllWallIDs();
  debug('Generating previews for %d walles', wallIds.length);
  debug(wallIds);

  debug('Started generating previews...');
  wallIds.forEach((wallId) => {
    debug(`Preview for ID ${wallId}`);

    const meta = db.getWallMetadata(wallId);
    const pixels = db.getWallPixels(wallId);

    const preview = genPreview(pixels, meta.Width, meta.Height);

    // fs.writeFileSync(`previews/${wallId}.png`, preview); // test

    db.setWallPreview(wallId, preview);
  });
  debug('Done generating previews');
}

// TEST STUFF
// genPreview(db.getWallPixels(1), 4, 2);

genPreviews();
