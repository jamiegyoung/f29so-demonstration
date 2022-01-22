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
  CREATE TABLE IF NOT EXISTS Canvas (
    CanvasID INTEGER PRIMARY KEY AUTOINCREMENT,
    Owner INTEGER NOT NULL,
    Preview BLOB,
    Width INTEGER NOT NULL,
    Height INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS CanvasPixel (
    CanvasID INTEGER NOT NULL,
    X INTEGER NOT NULL,
    Y INTEGER NOT NULL,
    Colour TEXT,
    HistoryID INTEGER
  );
`;
  db.exec(createTables);
}

exports.init = init;

/**
 * Get metadata for a canvas
 * @param {number} cid The canvas ID
 * @returns {JSON}
 */
function getCanvasMetadata(cid) {
  const getMetadata = db.prepare(
    'SELECT Owner,Width,Height FROM Canvas WHERE CanvasID=?;',
  );
  return getMetadata.get(cid);
}
exports.getCanvasMetadata = getCanvasMetadata;

/**
 * Get the pixels for a canvas
 * @param {number} cid The canvas ID
 * @returns {JSON}
 */
function getCanvasPixels(cid) {
  const getPixels = db.prepare(
    'SELECT X,Y,Colour FROM CanvasPixel WHERE CanvasID=?;',
  );
  return getPixels.all(cid);
}
exports.getCanvasPixels = getCanvasPixels;

/**
 * Create a new canvas
 * @param {string} owner
 * @param {number} width
 * @param {number} height
 */
function createCanvas(owner, width, height) {
  const createCanvasQr = db.prepare(
    'INSERT INTO Canvas(Owner,Width,Height) VALUES (?,?,?);',
  );
  createCanvasQr.run(owner, width, height);

  // Should return something to show if successful
}
exports.createCanvas = createCanvas;

/**
 * Get a single pixel from a canvas
 * @param {*} cid
 * @param {*} x
 * @param {*} y
 * @returns {JSON}
 */
function getPixel(cid, x, y) {
  const getPixelQr = db.prepare(
    'SELECT Colour,HistoryID FROM CanvasPixel WHERE CanvasID=? AND X=? AND Y=?;',
  );
  return getPixelQr.get(cid, x, y);
}
exports.getPixel = getPixel;

/**
 * Set a specific pixel on a canvas
 *
 * TODO: Add history stuff
 * @param {number} canvasId Canvas ID
 * @param {number} x
 * @param {number} y
 * @param {string} color Hex string (format: RRGGBBAA)
 * @param {string} user Not currently used
 */

function setPixel(canvasId, x, y, color, _user) {
  const existing = getPixel(canvasId, x, y);

  const colorString = color.toString(); // Make sure it's a string

  if (existing) {
    const updateExisting = db.prepare(
      'UPDATE CanvasPixel SET Colour=? WHERE CanvasID=? AND X=? AND Y=?;',
    );
    updateExisting.run(colorString, canvasId, x, y);

    // Something about history here
  } else {
    const createNew = db.prepare(
      'INSERT INTO CanvasPixel(CanvasID,X,Y,Colour) VALUES (?,?,?,?);',
    );
    createNew.run(canvasId, x, y, colorString);

    // Something about history here
  }
}
exports.setPixel = setPixel;

/**
 * Get all canvas IDs
 * @returns {number[]}
 */
function getAllCanvasIDs() {
  const qr = db.prepare('SELECT CanvasID FROM Canvas;');
  return qr.all().map((v) => v.CanvasID);
}

exports.getAllCanvasIDs = getAllCanvasIDs;

/**
 * Get the preview PNG for a canvas
 * @param {number} cid
 * @returns
 */
function getCanvasPreview(cid) {
  const qr = db.prepare('SELECT Preview FROM Canvas WHERE CanvasID=?');
  const res = qr.get(cid);
  return res ? res.Preview : undefined;
}
exports.getCanvasPreview = getCanvasPreview;

/**
 * Update canvas preview in the database
 * @param {number} cid
 * @param {Buffer} preview
 */
function setCanvasPreview(cid, preview) {
  const qr = db.prepare('UPDATE Canvas SET Preview=? WHERE CanvasID=?');
  qr.run(preview, cid);
}
exports.setCanvasPreview = setCanvasPreview;
