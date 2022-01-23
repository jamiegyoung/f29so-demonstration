// CONSTANTS
const port = 2000;
// IMPORTS
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const debug = require('debug')('server');
// const csurf = require('csurf');
const db = require('./src/db');
const { genPreview } = require('./src/preview-gen');

// EXPRESS STUFF
const app = express();

// CSRF (add later when implemented into front-end)
// const csrfMiddleware = csurf({
//   cookie: {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//   },
// });

// app.use(csrfMiddleware);

app.use(helmet());

app.use('/static', express.static(path.join(__dirname, './static/')));

app.use('/api', require('./src/routes/api'));

app.get('/', (req, res) => {
  debug('GET /');
  // res.cookie('CSRF-Token', req.csrfToken());
  res.sendFile(path.join(__dirname, './static/index.html'));
});

// INIT
app.listen(port);
debug(`Started server on port ${port}`);

db.init();

// OTHER FUNCTIONS

/**
 * Generate preview PNGs for all walles
 */
function genPreviews() {
  const wallIds = db.getAllWallIDs();
  debug('Generating previews for %d walles', wallIds.length);
  debug(wallIds);

  debug('Started generating previews...');
  wallIds.forEach((wallId) => {
    debug(`Preview for ID ${wallId}`);

    const meta = db.getWallMetadata(wallId);
    const pixels = db.getWallPixels(wallId);

    const preview = genPreview(pixels, meta.Width, meta.Height);

    // fs.writeFileSync(`previews/${wallId}.png`, preview); // test

    db.setWallPreview(wallId, preview);
  });
  debug('Done generating previews');
}

// TEST STUFF
// genPreview(db.getWallPixels(1), 4, 2);

genPreviews();
