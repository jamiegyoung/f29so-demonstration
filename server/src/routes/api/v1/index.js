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

router.get('/get-wall/:wallId', (req, res) => {
  debug('GET /api/v1/get-wall/:wallId');
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

router.get('/get-pixel/:wallId/:x/:y', (req, res) => {
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

router.get('/set-pixel/:wallId/:x/:y/:color/:user', (req, res) => {
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

router.get('/get-preview/:wallId', (req, res) => {
  const pre = db.getWallPreview(req.params.wallId);

  if (pre) {
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(pre);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Preview not found');
  }
});

module.exports = router;
