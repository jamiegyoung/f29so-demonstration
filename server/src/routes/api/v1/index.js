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
  getReportedWalls,
  getIsFollower,
  getIsFollowing,
  getFollowersCount,
  getFollowingCount,
  getWallCount,
  getUserLikeCount,
  addFollow,
  removeFollow,
  removeReport,
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
  max: 10000, // limit each IP to 1000 requests per windowMs
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
  debug('deleting self user', req.user.id);
  deleteUser(req.user.id);
  req.logout();
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

router.get('/get-wall/:wallID', idUserCheck, (req, res) => {
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

router.get('/create-wall', idUserCheck, async (req, res) => {
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

router.get('/get-user-walls/:userID', idUserCheck, (req, res) => {
  debug('GET /api/v1/get-user-walls/:userID');
  const { userID } = req.params;
  const walls = getUserWalls(userID);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(walls));
});

router.get('/toggle-like/:wallID', idUserCheck, (req, res) => {
  const { wallID } = req.params;

  const userID = req.user.id;
  if (wallID && userID) {
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
  debug('GET /api/v1/user');
  const contributionCount = getContributionCount(req.user.id);
  const followingCount = getFollowingCount(req.user.id);
  const followerCount = getFollowersCount(req.user.id);
  const wallCount = getWallCount(req.user.id);
  const likeCount = getUserLikeCount(req.user.id);
  res.end(
    JSON.stringify({
      ...req.user,
      contributionCount,
      followingCount,
      followerCount,
      wallCount,
      likeCount,
    }),
  );
});

router.get('/user/:userID', idUserCheck, (req, res) => {
  debug('GET /api/v1/user/:userID');
  const { userID } = req.params;
  if (!userID) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return;
  }
  const user = getUser(userID);
  const contributionCount = getContributionCount(userID);
  const followingCount = getFollowingCount(userID);
  const followerCount = getFollowersCount(userID);
  const wallCount = getWallCount(userID);
  const likeCount = getUserLikeCount(userID);
  if (req.user && userID === req.user.id) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        ...user,
        contributionCount,
        followingCount,
        followerCount,
        wallCount,
        likeCount,
      }),
    );
    return;
  }
  const isFollowing = getIsFollowing(userID, req.user.id);
  const isFollower = getIsFollower(userID, req.user.id);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      ...user,
      contributionCount,
      followingCount,
      followerCount,
      wallCount,
      likeCount,
      isFollowing,
      isFollower,
    }),
  );
});

router.get('/contributions/:userID', idUserCheck, (req, res) => {
  debug('GET /api/v1/contributions/:userID');
  const { userID } = req.params;
  if (!userID) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('No user ID provided');
    return;
  }
  const contributions = getContributions(userID);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(contributions));
});

router.get('/following/:userID', idUserCheck, (req, res) => {
  debug('GET /api/v1/following/:userID');
  const { userID } = req.params;
  if (!userID) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('No user ID provided');
    return;
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(getFollowing(userID)));
});

router.delete('/remove-report/:wallID', idUserCheck, (req, res) => {
  debug('GET /api/v1/remove-report/:wallID');
  const { wallID } = req.params;
  if (!wallID) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('No wall ID provided');
    return;
  }
  if (!getIsAdmin(req.user.id)) {
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.end('Unauthorized');
    return;
  }
  removeReport(wallID);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ wallID }));
});

router.get('/reported-walls', idUserCheck, (req, res) => {
  debug('GET /api/v1/reported-walls');
  if (!getIsAdmin(req.user.id)) {
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.end('Unauthorized');
    return;
  }

  const walls = getReportedWalls(req.user.id);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(walls));
});

router.get('/follow/:userID', idUserCheck, (req, res) => {
  debug('GET /api/v1/follow/:userID');
  const { userID } = req.params;
  if (!userID) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('No user ID provided');
    return;
  }
  const isFollowing = getIsFollowing(userID, req.user.id);
  if (isFollowing) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Already following');
    return;
  }
  addFollow(userID, req.user.id);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ userID }));
});

router.get('/unfollow/:userID', idUserCheck, (req, res) => {
  debug('GET /api/v1/unfollow/:userID');
  const { userID } = req.params;
  if (!userID) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('No user ID provided');
    return;
  }
  const isFollowing = getIsFollowing(userID, req.user.id);
  if (!isFollowing) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Not following');
    return;
  }
  removeFollow(userID, req.user.id);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ userID }));
});

export default router;
