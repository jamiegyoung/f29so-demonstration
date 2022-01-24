const debug = require('debug')('db');

// CONSTANTS
const dbFile = 'database.db';

// IMPORTS
const Sqlite = require('better-sqlite3');

const db = new Sqlite(dbFile);
// eslint-disable-next-line no-console
debug(`Connected to database "${dbFile}"`);

function init() {
  const createTables = `
  CREATE TABLE IF NOT EXISTS Wall (
    wallID INTEGER PRIMARY KEY AUTOINCREMENT,
    owner INTEGER NOT NULL,
    preview BLOB,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS WallPixel (
    wallID INTEGER NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    color TEXT,
    historyID INTEGER
  );
`;
  db.exec(createTables);
}

exports.init = init;

/**
 * Get metadata for a wall
 * @param {number} cid The wall ID
 * @returns {JSON}
 */
function getWallMetadata(cid) {
  const getMetadata = db.prepare(
    'SELECT owner,width,height,wallID FROM Wall WHERE wallID=?;',
  );
  return getMetadata.get(cid);
}
exports.getWallMetadata = getWallMetadata;

/**
 * Get the pixels for a wall
 * @param {number} wallID The wall ID
 * @returns {JSON}
 */
function getWallPixels(wallID) {
  const getPixels = db.prepare(
    'SELECT x,y,color FROM wallPixel WHERE wallID=?;',
  );
  return getPixels.all(wallID);
}
exports.getWallPixels = getWallPixels;

/**
 * Create a new wall
 * @param {string} owner
 * @param {number} width
 * @param {number} height
 */
function createWall(owner, width, height) {
  debug('Creating new wall');
  const createWallQr = db.prepare(
    'INSERT INTO Wall(owner,width,height) VALUES (?,?,?);',
  );

  const { lastInsertRowid } = createWallQr.run(owner, width, height);
  const insertPixel = db.prepare(
    'INSERT INTO WallPixel(wallID,x,y,color) VALUES (?,?,?,?);',
  );

  const pixelArray = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < height; x += 1) {
      pixelArray.push({
        wallID: lastInsertRowid,
        x,
        y,
        color: '#FFFFFF',
      });
    }
  }

  const insertAllPixels = db.transaction((pixels) => {
    pixels.forEach((pixel) => {
      insertPixel.run(pixel.wallID, pixel.x, pixel.y, pixel.color);
    });
  });

  insertAllPixels(pixelArray);
  // Should return something to show if successful
}
exports.createWall = createWall;

/**
 * Get a single pixel from a wall
 * @param {*} wallID
 * @param {*} x
 * @param {*} y
 * @returns {JSON}
 */
function getPixel(wallID, x, y) {
  const getPixelQr = db.prepare(
    'SELECT color,HistoryID FROM WallPixel WHERE wallID=? AND color=? AND y=?;',
  );
  return getPixelQr.get(wallID, x, y);
}
exports.getPixel = getPixel;

/**
 * Set a specific pixel on a wall
 *
 * TODO: Add history stuff
 * @param {number} wallID Wall ID
 * @param {number} x
 * @param {number} y
 * @param {string} color Hex string (format: RRGGBBAA)
 * @param {string} user Not currently used
 */

function setPixel(wallID, x, y, color, _user) {
  const existing = getPixel(wallID, x, y);

  const colorString = color.toString(); // Make sure it's a string

  if (existing) {
    const updateExisting = db.prepare(
      'UPDATE WallPixel SET color=? WHERE wallID=? AND x=? AND y=?;',
    );
    updateExisting.run(colorString, wallID, x, y);

    // Something about history here
  } else {
    const createNew = db.prepare(
      'INSERT INTO WallPixel(wallID,x,y,color) VALUES (?,?,?,?);',
    );
    createNew.run(wallID, x, y, colorString);

    // Something about history here
  }
}
exports.setPixel = setPixel;

/**
 * Get all wall IDs
 * @returns {number[]}
 */
function getAllWallIDs() {
  const qr = db.prepare('SELECT wallID FROM Wall;');
  return qr.all().map((v) => v.wallID);
}

exports.getAllWallIDs = getAllWallIDs;

/**
 * Get the preview PNG for a wall
 * @param {number} wallID
 * @returns
 */
function getWallPreview(wallID) {
  const qr = db.prepare('SELECT preview FROM Wall WHERE wallID=?');
  const res = qr.get(wallID);
  return res ? res.Preview : undefined;
}
exports.getWallPreview = getWallPreview;

/**
 * Update wall preview in the database
 * @param {number} wallID
 * @param {Buffer} preview
 */
function setWallPreview(wallID, preview) {
  const qr = db.prepare('UPDATE Wall SET preview=? WHERE wallID=?');
  qr.run(preview, wallID);
}
exports.setWallPreview = setWallPreview;
