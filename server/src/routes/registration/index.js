import express from 'express';
import rateLimit from 'express-rate-limit';
import Debug from 'debug';
import { getUserByUsername } from '../../db.js';

const debug = Debug('registration');
const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 registration requests per windowMs
  message: 'Too many requests, please try again later',
});

router.get('/submit', apiLimiter, (req, res) => {
  debug('hellow world!');
  res.send('Hello World!');
});

const usernameCheckLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // limit each IP to 50 username checks per windowMs
  message: 'Too many requests, please try again later',
});

router.get('/check-username/:username', usernameCheckLimiter,  (req, res) => {
  debug('checking username');
  const { username } = req.params;
  const user = getUserByUsername(username);
  if (user) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ username, available: false }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ username, available: true }));
});

export default router;
