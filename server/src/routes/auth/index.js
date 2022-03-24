import express from 'express';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oidc';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import config from '../../../config.json' assert { type: 'json' };
import Debug from 'debug';
import { getIdFromCredentials, getUser, addCredentials } from '../../db.js';

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
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: config.google.clientId,
//       clientSecret: config.google.clientSecret,
//       callbackURL: config.google.callbackURL,
//     },
//     function verify(issuer, profile, cb) {
//       debug('verifying google login');
//       const userID = getIdFromCredentials(issuer, profile.id);
//       if (userID) {
//         const user = getUser(userID);
//         debug('user found');
//         return cb(null, user);
//       }
//       debug('user not found');
//       debug('new user added with id: ' + userID);
//       return cb(null, newUser);
//     },
//   ),
// );

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook.clientId,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL,
    },
    function verify(accessToken, refreshToken, profile, cb) {
      debug('verifying facebook login');
      const userID = getIdFromCredentials('facebook', profile.id);
      if (userID) {
        debug('user credentials found', userID);
        const user = getUser(userID);
        if (user) {
          debug('user found');
          return cb(null, { ...user, isNew: false });
        }
        debug('user credentials found but user not found');
        return cb(null, { id: userID, isNew: true });
      }
      debug('user credentials not found');
      const newUserID = addCredentials('facebook', profile.id);
      debug('new credentials added with id: ' + newUserID.id);
      return cb(null, { id: newUserID, isNew: true });
    },
  ),
);

router.get('/login/google', passport.authenticate('google'));

router.get('/login/facebook', passport.authenticate('facebook'));

function isUser(req, res, next) {
  if (req.user.isNew) {
    debug('user is new');
    res.redirect('/registration');
    return;
  }
  debug('user is not new');
  res.redirect('/');
  next();
}

router.get(
  '/redirect/google',
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureMessage: 'Failed to log in',
  }),
  isUser,
);

router.get(
  '/redirect/facebook',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    failureMessage: 'Failed to log in',
  }),
  isUser,
);

export default router;
export { initializePassport };
