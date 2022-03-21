import express from 'express';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oidc';
import config from '../../../config.json' assert { type: 'json' };
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

function initializePassport(app) {
  app.use(passport.initialize());
  app.use(passport.session());
}

// Every api request will be rate limited
router.use(apiLimiter);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = getUser(id)
  done(null, user);
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
  }),
  (req, res, next) => {
    debug('redirected from google');
    res.redirect('/');
    next();
  },
);

export default router;
export { initializePassport };