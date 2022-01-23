const express = require('express');
const rateLimit = require('express-rate-limit');
const debug = require('debug')('server');
const db = require('../../../db');

const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
});

// Every api request will be rate limited
router.use(apiLimiter);

router.get('/get-wall/:wallID', (req, res) => {
  debug('GET /api/v1/get-wall/:wallID');
  const { wallID } = req.params;

  const data = db.getWallMetadata(wallID);
  const pixels = db.getWallPixels(wallID);

  if (!data) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Wall does not exist');
    return;
  }

  data.pixels = pixels;

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
});

router.get('/create-wall/:owner/:width/:height', (req, res) => {
  // TODO: add validation
  // const succ = db.createWall(
  //   req.params.owner,
  //   req.params.width,
  //   req.params.height,
  // );

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('done');
});

router.get('/get-pixel/:wallID/:x/:y', (req, res) => {
  const { wallID } = req.params;
  const x = parseInt(req.params.x, 10);
  const y = parseInt(req.params.y, 10);

  const meta = db.getWallMetadata(wallID);

  // Verify coordinates are within the wall
  if (x < 0 || x >= meta.Width || y < 0 || y >= meta.Height) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid coordinates');
    return;
  }

  const pixel = db.getPixel(wallID, x, y);

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

router.get('/set-pixel/:wallID/:x/:y/:color/:user', (req, res) => {
  const { wallID } = req.params;
  const x = parseInt(req.params.x, 10);
  const y = parseInt(req.params.y, 10);
  let { color } = req.params;

  const meta = db.getWallMetadata(wallID);

  // Verify coordinates are within the wall
  if (x < 0 || x >= meta.Width || y < 0 || y >= meta.Height) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid coordinates');
    return;
  }

  color = color.toString(); // Just to make sure

  if (color.length !== 8) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid color format');
    return;
  }

  db.setPixel(wallID, x, y, color, req.params.user);

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('done');
});

router.get('/get-preview/:wallID', (req, res) => {
  const pre = db.getWallPreview(req.params.wallID);

  if (pre) {
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(pre);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Preview not found');
  }
});

module.exports = router;
