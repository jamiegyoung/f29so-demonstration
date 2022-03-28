import express from 'express';
import rateLimit from 'express-rate-limit';
import Debug from 'debug';
import { addUser, getUserByEmail, getUserByUsername } from '../../db.js';
import { validate as validateEmail } from 'email-validator';

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

function hasSessionPassportUser(req, res) {
  if (!req.session) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('User has no session');
    return false;
  }

  if (!req.session.passport) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('No session found');
    return false;
  }

  if (!req.session.passport.user) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('No session user found');
    return false;
  }

  return true;
}

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

  const username = req.body.username.toLowerCase();

  if (username.length > 15) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Username is too long');
    return;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Username contains invalid characters');
    return;
  }

  const usernameConflict = getUserByUsername(username);
  if (usernameConflict) {
    res.writeHead(409, { 'Content-Type': 'text/plain' });
    res.end('Username is already taken');
    return;
  }

  const email = req.body.email.toLowerCase();

  const emailConflict = getUserByEmail(email);
  if (emailConflict) {
    res.writeHead(409, { 'Content-Type': 'text/plain' });
    res.end('Email is already taken');
    return;
  }

  if (email.length > 320) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Email is too long');
    return;
  }

  if (!validateEmail(email)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid email');
    return;
  }

  const user = addUser(req.user.id, username, email);
  if (!user) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Failed to register user');
    return;
  }

  if (!hasSessionPassportUser(req, res)) {
    return;
  }

  req.session.passport.user = user;
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
});

const usernameCheckLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // limit each IP to 50 username checks per windowMs
  message: 'Too many requests, please try again later',
});

router.get('/check-username/:username', usernameCheckLimiter, (req, res) => {
  debug('checking username');
  const { username } = req.params;
  const user = getUserByUsername(username.toLowerCase());
  if (user) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ username, available: false }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ username, available: true }));
});

export default router;
