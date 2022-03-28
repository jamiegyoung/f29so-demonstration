import express from 'express';
import rateLimit from 'express-rate-limit';
import Debug from 'debug';
import {
  getWallMetadata,
  getWallPixels,
  createWall,
  deleteWall,
  getFeed,
  toggleLikes,
  getLikes,
  getUser,
  getContributions,
  getContributionCount,
  getFollowing,
  getUserWalls,
  getIsAdmin,
  reportWall,
  deleteUser,
} from '../../../db.js';

const debug = Debug('api/v1');
const router = express.Router();

const idUserCheck = (req, res, next) => {
  if (!req.user) {
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.end('Unauthorized');
    return;
  }
  if (!req.user.id) {
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.end('Unauthorized');
    return;
  }
  next();
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests, please try again later',
});

// Every api request will be rate limited
router.use(apiLimiter);

router.delete('/delete-user/:userID', idUserCheck, (req, res) => {
  const isAdmin = getIsAdmin(req.user.id);
  debug('test', isAdmin);

  if (!isAdmin || req.user.id === req.params.userID) {
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.end('Unauthorized');
    return;
  }
  const isOtherAdmin = getIsAdmin(req.params.userID);

  if (isOtherAdmin) {
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.end('Unauthorized');
    return;
  }

  deleteUser(req.params.userID);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

router.delete('/delete-user', idUserCheck, (req, res) => {
  debug('deleting self user');
  deleteUser(req.user.id);
  req.session.destroy();
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

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

router.get('/create-wall/', idUserCheck, async (req, res) => {
  const wallID = await createWall(req.user.id, 32, 32);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ wallID }));
});

router.get('/delete-wall/:wallID', idUserCheck, (req, res) => {
  if (!req.params.wallID) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('No wall ID provided');
    return;
  }
  const isAdmin = getIsAdmin(req.user.id);
  const { ownerID } = getWallMetadata(req.params.wallID);
  debug('wall ownerID: ', ownerID, 'userID: ', req.user.id);
  if (ownerID !== req.user.id && !isAdmin) {
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.end('Unauthorized');
    return;
  }
  const { wallID } = req.params;
  deleteWall(wallID);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ wallID }));
});

router.get('/report-wall/:wallID', idUserCheck, (req, res) => {
  if (!req.params.wallID) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('No wall ID provided');
    return;
  }

  const { ownerID } = getWallMetadata(req.params.wallID);
  debug('wall ownerID: ', ownerID, 'userID: ', req.user.id);

  if (ownerID === req.user.id) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Cannot report your own wall');
    return;
  }

  const { wallID } = req.params;
  reportWall(wallID);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ wallID }));
});

router.get('/get-feed/:page', idUserCheck, (req, res) => {
  const feed = getFeed(req.user.id);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(feed));
});

router.get('/get-user-walls', idUserCheck, (req, res) => {
  debug('GET /api/v1/get-user-walls');
  const walls = getUserWalls(req.user.id);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(walls));
});

router.get('/get-user-walls/:userID', (req, res) => {
  debug('GET /api/v1/get-user-walls/:userID');
  const { userID } = req.params;
  const walls = getUserWalls(userID);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(walls));
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

router.get('/user', idUserCheck, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      ...req.user,
      contributionCount: getContributionCount(req.user.id),
    }),
  );
});

router.get('/user/:userID', (req, res) => {
  debug('GET /api/v1/user/:userID');
  const { userID } = req.params;
  if (!userID) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return;
  }

  const user = getUser(userID);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  const contributionCount = getContributionCount(userID);
  res.end(JSON.stringify({ ...user, contributionCount }));
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
