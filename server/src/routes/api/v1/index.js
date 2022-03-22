import express from 'express';
import rateLimit from 'express-rate-limit';
import Debug from 'debug';
import {
  getWallMetadata,
  getWallPixels,
  createWall,
  getFeed,
  addLike,
  getLikes,
  getUser,
  getContributions,
  getContributionCount,
} from '../../../db.js';

const debug = Debug('api/v1');
const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests, please try again later',
});

// Every api request will be rate limited
router.use(apiLimiter);

router.get('/get-wall/:wallID', (req, res) => {
  debug('GET /api/v1/get-wall/:wallID');
  const { wallID } = req.params;

  const data = getWallMetadata(wallID);
  const pixels = getWallPixels(wallID);

  if (!data) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Wall does not exist');
    return;
  }

  data.pixels = pixels;

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
});

router.get('/create-wall/:ownerID/', async (req, res) => {
  await createWall(req.params.ownerID, 32, 32);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('done');
});

router.get('/get-feed/:userID/:page', (req, res) => {
  const { userID, page } = req.params;
  if (userID && page) {
    const feed = getFeed(userID);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(feed));
    return;
  }
  res.writeHead(400, { 'Content-Type': 'text/plain' });
});

router.get('/add-like/:wallID/:userID', (req, res) => {
  const { wallID, userID } = req.params;
  if (wallID && userID) {
    addLike(wallID, userID);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const likes = getLikes(wallID);
    res.end(JSON.stringify(likes.length));
    return;
  }
  res.writeHead(400, { 'Content-Type': 'text/plain' });
});

router.get('/user', (req, res) => {
  if (req.user) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(req.user));
    return;
  }
  res.writeHead(400, { 'Content-Type': 'text/plain' });
});

router.get('/user/:userID', (req, res) => {
  debug('GET /api/v1/user/:userID');
  const { userID } = req.params;
  if (userID) {
    const user = getUser(userID);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
    return;
  }
  res.writeHead(400, { 'Content-Type': 'text/plain' });
});

router.get('/contributions/:userID', (req, res) => {
  debug('GET /api/v1/contributions/:userID');
  const { userID } = req.params;
  if (!userID) return res.writeHead(400, { 'Content-Type': 'text/plain' });
  const contributions = getContributions(userID);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(contributions));
});

router.get('/contribution-count/:userID', (req, res) => {
  debug('GET /api/v1/contributions/:userID');
  const { userID } = req.params;
  if (!userID) return res.writeHead(400, { 'Content-Type': 'text/plain' });
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(getContributionCount(userID)));
});

export default router;
