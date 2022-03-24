import express from 'express';
import rateLimit from 'express-rate-limit';
import Debug from 'debug';
import {
  addUser,
  getUser,
  getUserByEmail,
  getUserByUsername,
} from '../../db.js';

const debug = Debug('registration');
const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 registration requests per windowMs
  message: 'Too many requests, please try again later',
});

router.get('/', (req, res, next) => {
  debug('GET /registration');
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  next();
});

router.post('/submit', apiLimiter, (req, res) => {
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

  if (!req.user.isNew) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('User is already registered');
    return;
  }
  if (!req.body.username || !req.body.email) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Missing username or email');
    return;
  }

  if (req.body.username.length > 15) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Username is too long');
    return;
  }

  const usernameConflict = getUserByUsername(req.body.username);
  if (usernameConflict) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Username is already taken');
    return;
  }

  const emailConflict = getUserByEmail(req.body.email);
  if (emailConflict) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Email is already taken');
    return;
  }

  if (req.body.email.length > 320) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Email is too long');
    return;
  }

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(req.body.email)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid email');
    return;
  }

  const user = addUser(req.user.id, req.body.username, req.body.email);
  if (user) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
    return;
  }

  res.writeHead(400, { 'Content-Type': 'text/plain' });
  res.end('Failed to register user');
});

const usernameCheckLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // limit each IP to 50 username checks per windowMs
  message: 'Too many requests, please try again later',
});

router.get('/success', (req, res) => {
  debug('GET /registration/success');
  debug('user:', req.user);
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

  const user = getUser(req.user.id);
  if (!user) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('User not found');
    return;
  }

  if (!req.session) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('User has no session');
    return;
  }

  if (!req.session.passport) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('No session found');
    return;
  }

  if (!req.session.passport.user) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('No session user found');
    return;
  }

  req.session.passport.user = user;
  res.redirect('/');
});

router.get('/check-username/:username', usernameCheckLimiter, (req, res) => {
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
