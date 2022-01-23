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
    colour TEXT,
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
 * @param {number} cid The wall ID
 * @returns {JSON}
 */
function getWallPixels(cid) {
  const getPixels = db.prepare(
    'SELECT x,y,colour FROM wallPixel WHERE wallID=?;',
  );
  return getPixels.all(cid);
}
exports.getWallPixels = getWallPixels;

/**
 * Create a new wall
 * @param {string} owner
 * @param {number} width
 * @param {number} height
 */
function createWall(owner, width, height) {
  const createWallQr = db.prepare(
    'INSERT INTO Wall(owner,width,height) VALUES (?,?,?);',
  );
  createWallQr.run(owner, width, height);

  // Should return something to show if successful
}
exports.createWall = createWall;

/**
 * Get a single pixel from a wall
 * @param {*} cid
 * @param {*} x
 * @param {*} y
 * @returns {JSON}
 */
function getPixel(cid, x, y) {
  const getPixelQr = db.prepare(
    'SELECT Colour,HistoryID FROM WallPixel WHERE WallID=? AND X=? AND Y=?;',
  );
  return getPixelQr.get(cid, x, y);
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
      'UPDATE WallPixel SET Colour=? WHERE WallID=? AND X=? AND Y=?;',
    );
    updateExisting.run(colorString, wallID, x, y);

    // Something about history here
  } else {
    const createNew = db.prepare(
      'INSERT INTO WallPixel(WallID,X,Y,Colour) VALUES (?,?,?,?);',
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
  const qr = db.prepare('SELECT WallID FROM Wall;');
  return qr.all().map((v) => v.WallID);
}

exports.getAllWallIDs = getAllWallIDs;

/**
 * Get the preview PNG for a wall
 * @param {number} cid
 * @returns
 */
function getWallPreview(cid) {
  const qr = db.prepare('SELECT Preview FROM Wall WHERE WallID=?');
  const res = qr.get(cid);
  return res ? res.Preview : undefined;
}
exports.getWallPreview = getWallPreview;

/**
 * Update wall preview in the database
 * @param {number} cid
 * @param {Buffer} preview
 */
function setWallPreview(cid, preview) {
  const qr = db.prepare('UPDATE Wall SET Preview=? WHERE WallID=?');
  qr.run(preview, cid);
}
exports.setWallPreview = setWallPreview;
