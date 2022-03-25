import express from 'express';
import rateLimit from 'express-rate-limit';
import Debug from 'debug';
import {
  getWallMetadata,
  getWallPixels,
  createWall,
  getFeed,
  toggleLikes,
  getLikes,
  getUser,
  getContributions,
  getContributionCount,
  getFollowing,
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

router.get('/create-wall/', async (req, res) => {
  if (!req.user) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('User has no credentials');
    return;
  }
  if (!req.user.id) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('User has no id');
    return;
  }

  await createWall(req.user.id, 32, 32);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('done');
});

router.get('/get-feed/:page', (req, res) => {
  debug(req.user);
  if (!req.user) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('User is not logged in');
    return;
  }
  const { id } = req.user;
  if (id) {
    const feed = getFeed(id);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(feed));
    return;
  }
  res.writeHead(400, { 'Content-Type': 'text/plain' });
  res.end('User is not logged in');
});

router.get('/toggle-like/:wallID', (req, res) => {
  const { wallID } = req.params;

  const userID = req.user.id;
  if (wallID && userID) {
    debug('yoo');
    const toggleRes = toggleLikes(wallID, userID);
    const likes = getLikes(wallID);
    debug('toggleRes', toggleRes);
    debug('likes', likes);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ likes: likes.length, ...toggleRes }));
    return;
  }
  res.writeHead(400, { 'Content-Type': 'text/plain' });
  res.end('Invalid request');
});

router.get('/user', (req, res) => {
  if (req.user) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        ...req.user,
        contributionCount: getContributionCount(req.user.id),
      }),
    );
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
    const contributionCount = getContributionCount(userID);
    res.end(JSON.stringify({ ...user, contributionCount }));
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

router.get('/following/:userID', (req, res) => {
  debug('GET /api/v1/following/:userID');
  const { userID } = req.params;
  if (!userID) return res.writeHead(400, { 'Content-Type': 'text/plain' });
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(getFollowing(userID)));
});

export default router;
