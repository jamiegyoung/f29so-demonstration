import express from 'express';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oidc';
import config from './auth.json' assert { type: 'json' };
import session from 'express-session';
import Debug from 'debug';
import { getIdFromCredentials, getUser, addUser } from '../../db.js';

const debug = Debug('auth');

const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 login requests per windowMs
  message: 'Too many requests, please try again later',
});

// Every api request will be rate limited
router.use(apiLimiter);

router.use(
  session({
    secret: config.sessionSecret,
  }),
);

router.get('/redirect', (req, res) => {
  res.redirect('/pog');
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL,
    },
    function verify(issuer, profile, cb) {
      debug('verifying');
      const userID = getIdFromCredentials(issuer, profile.id);
      if (userID) {
        const user = getUser(userID);
        debug('user found');
        return cb(null, user);
      }
      debug('user not found');
      const newUser = addUser(issuer, profile.id, 'bob');
      debug('new user added with id: ' + newUser.id);
      return cb(null, newUser);
    },
  ),
);

router.get('/login/google', passport.authenticate('google'));

router.get(
  '/redirect/google',
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureMessage: 'Failed to log in',
    successRedirect: '/home',
  }),
);

export default router;
