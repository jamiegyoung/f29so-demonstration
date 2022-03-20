// CONSTANTS
// IMPORTS
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import Debug from 'debug';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
// const csurf = require('csurf');
import { scheduleJob } from 'node-schedule';
import {
  init as initDb,
  getAllWallMetadatas,
  // updatePreview,
  getWallPixels,
  setWallPreview,
} from './src/db.js';

import api from './src/routes/api/index.js';
import auth from './src/routes/auth/index.js';

import walls from './src/walls.js';
import genPreviewBuffer from './src/genPreview.js';

const dir = dirname(fileURLToPath(import.meta.url));

const debug = Debug('server');
const port = 7379;
// const { genPreview } = require('./src/preview-gen');

// EXPRESS STUFF
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
// init the walls sockets
walls(io);

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

app.use(helmet());
app.use(express.static(path.join(dir, './public')));

app.use('/api', api);
app.use('/auth', auth);
app.get('*', (req, res) => res.sendFile(path.join(dir, './public/index.html')));

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
