// CONSTANTS
// IMPORTS
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import Debug from 'debug';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
// const csurf = require('csurf');
import config from './config.json' assert { type: 'json' };

import { scheduleJob } from 'node-schedule';
import {
  init as initDb,
  getAllWallMetadatas,
  // updatePreview,
  getWallPixels,
  setWallPreview,
} from './src/db.js';

import api from './src/routes/api/index.js';
import auth, { initializePassport } from './src/routes/auth/index.js';
import registration from './src/routes/registration/index.js';

import walls from './src/walls.js';
import genPreviewBuffer from './src/genPreview.js';

const dir = dirname(fileURLToPath(import.meta.url));

const debug = Debug('server');
const port = 7379;
// const { genPreview } = require('./src/preview-gen');

// EXPRESS STUFF
const app = express();
const httpServer = createServer(app);

const sessionMiddleware = session({
  secret: config.sessionSecret,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    secret: config.sessionSecret,
  },
});

const io = new Server(httpServer);
// init the walls sockets

walls(io, sessionMiddleware);

app.set('socketio', io);

debug(`Started server on port ${port}`);

initDb();

httpServer.listen(port, () => {
  debug(`Listening on port ${port}`);
});

// CSRF (add later when implemented into front-end)
// const csrfMiddleware = csurf({
//   cookie: {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//   },
// });

// app.use(csrfMiddleware);

app.use(express.static(path.join(dir, '/public')));

app.use(cookieParser());
app.use(sessionMiddleware);

initializePassport(app);

const loggedIn = (req, res, next) => {
  debug('checking if user is logged in');
  if (req.user) {
    debug('user is logged in');
    debug(req.user);
    return next();
  }
  debug('user is not logged in');
  res.redirect('/login');
};

const avoidIfLoggedIn = (req, res, next) => {
  debug('checking if user is logged in');
  if (req.user) {
    if (req.user.isNew === false) {
      return res.redirect('/');
    }
  }
  debug('user is not logged in');
  next();
};

const servePage = (_req, res) =>
  res.sendFile(path.join(dir, './private/index.html'));

app.use(helmet());
app.use(bodyParser.json());

app.use('/registration', avoidIfLoggedIn, registration, servePage);
app.use('/api', api);
// app.use('/api', loggedIn, api);
app.use('/auth', auth);
app.get('/wall/*', loggedIn, servePage);
app.get('/login', avoidIfLoggedIn, servePage);
app.all('*', loggedIn, servePage);

async function genWallPreviews() {
  const allMetadata = getAllWallMetadatas();
  if (allMetadata.length === 0) return;
  for (let i = 0; i < allMetadata.length; i += 1) {
    debug('generating preview for wall', allMetadata[i].wallID);
    const metadata = allMetadata[i];
    const pixels = getWallPixels(metadata.wallID);
    // eslint-disable-next-line no-await-in-loop
    const buffer = await genPreviewBuffer(
      metadata.width,
      metadata.height,
      pixels,
    );
    setWallPreview(metadata.wallID, buffer);
  }
}

scheduleJob('*/5 * * * *', () => {
  genWallPreviews();
});

genWallPreviews();
