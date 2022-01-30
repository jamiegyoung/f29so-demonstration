import Debug from 'debug';
import Sqlite from 'better-sqlite3';
import genPreviewBuffer from './genPreview.js';

const dbFile = 'database.db';

const debug = Debug('db');
const db = new Sqlite(dbFile);
debug(`Connected to database "${dbFile}"`);

export const init = () => {
  const createTables = `
  CREATE TABLE IF NOT EXISTS Wall (
    wallID INTEGER PRIMARY KEY AUTOINCREMENT,
    owner INTEGER NOT NULL,
    preview BLOB,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    edits INTEGER NOT NULL DEFAULT 0,
    likes INTEGER NOT NULL DEFAULT 0,
    lastEdit INTEGER NOT NULL DEFAULT (cast(strftime('%s','now') as int))
  );

  CREATE TABLE IF NOT EXISTS WallPixel (
    pixelID INTEGER PRIMARY KEY AUTOINCREMENT,
    wallID INTEGER NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    color TEXT,
    FOREIGN KEY (wallID) REFERENCES Wall(wallID)
  );

  CREATE TABLE IF NOT EXISTS History (
    pixelID INTEGER NOT NULL,
    editor INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    color TEXT,
    FOREIGN KEY(pixelID) REFERENCES WallPixel(pixelID)
  );
`;
  db.exec(createTables);
};

/**
 * Get metadata for a wall
 * @param {number} cid The wall ID
 * @returns {JSON}
 */
export const getWallMetadata = (cid) => {
  const getMetadata = db.prepare(
    'SELECT owner,width,height,wallID FROM Wall WHERE wallID=?;',
  );
  return getMetadata.get(cid);
};

export const updateWallMetadata = (cid, metadata) => {
  const updateMetadata = db.prepare(
    'UPDATE Wall SET width=?,height=?,lastEdit=? WHERE wallID=?;',
  );
  updateMetadata.run(metadata.width, metadata.height, metadata.lastEdit, cid);
};

export const getAllWallMetadatas = () => {
  const qr = db.prepare('SELECT owner,width,height,wallID FROM Wall;');
  return qr.all();
};

/**
 * Get the pixels for a wall
 * @param {number} wallID The wall ID
 * @returns {JSON}
 */
export const getWallPixels = (wallID) => {
  const getPixels = db.prepare(
    'SELECT pixelID,x,y,color FROM wallPixel WHERE wallID=?;',
  );
  return getPixels.all(wallID);
};

export const updatePreview = (wallID, buffer) => {
  const qr = db.prepare('UPDATE Wall SET preview=? WHERE WallID=?');
  qr.run(buffer, wallID);
};

/**
 * Create a new wall
 * @param {string} owner
 * @param {number} width
 * @param {number} height
 */
export const createWall = async (owner, width, height) => {
  const createWallQr = db.prepare(
    'INSERT INTO Wall(owner,width,height) VALUES (?,?,?);',
  );

  const { lastInsertRowid: wallID } = createWallQr.run(owner, width, height);

  const pixelArray = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      pixelArray.push({
        wallID,
        x,
        y,
        color: '#FFFFFF',
      });
    }
  }

  const insertPixel = db.prepare(
    'INSERT INTO WallPixel(wallID,x,y,color) VALUES (?,?,?,?);',
  );

  const insertHistory = db.prepare(
    'INSERT INTO History(pixelID,editor,timestamp,color) VALUES (?,?,?,?);',
  );

  // function generateRandomColor() {
  //   const letters = '0123456789ABCDEF';
  //   let color = '#';
  //   for (let i = 0; i < 6; i += 1) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // }

  const insertAllPixels = db.transaction((pixels) => {
    pixels.forEach((pixel) => {
      const { lastInsertRowid: pixelID } = insertPixel.run(
        pixel.wallID,
        pixel.x,
        pixel.y,
        pixel.color,
      );
      insertHistory.run(pixelID, owner, Date.now(), pixel.color);
    });
  });

  insertAllPixels(pixelArray);
  updatePreview(wallID, await genPreviewBuffer(width, height, pixelArray));
  // Should return something to show if successful
};

/**
 * Get a single pixel from a wall
 * @param {*} wallID
 * @param {*} x
 * @param {*} y
 * @returns {JSON}
 */
export const getPixel = (wallID, x, y) => {
  const getPixelQr = db.prepare(
    'SELECT color,HistoryID FROM WallPixel WHERE wallID=? AND color=? AND y=?;',
  );
  return getPixelQr.get(wallID, x, y);
};

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

export const updatePixels = (wallID, pixels) => {
  if (!pixels) return;
  const updatePixel = db.prepare(
    'UPDATE WallPixel SET color=? WHERE wallID=? AND x=? AND y=?;',
  );
  const insertHistory = db.prepare(
    'INSERT INTO History(pixelID,editor,timestamp,color) VALUES (?,?,?,?);',
  );

  const updateAllPixels = db.transaction((px) => {
    px.forEach((pixel) => {
      updatePixel.run(pixel.color, wallID, pixel.x, pixel.y);
      pixel.history.forEach((history) => {
        insertHistory.run(
          pixel.pixelID,
          history.editor,
          history.timestamp,
          history.color,
        );
      });
    });
  });

  updateAllPixels(pixels);
};

/**
 * Get all wall IDs
 * @returns {number[]}
 */
export const getAllWallIDs = () => {
  const qr = db.prepare('SELECT wallID FROM Wall;');
  return qr.all().map((v) => v.wallID);
};

/**
 * Get the preview PNG for a wall
 * @param {number} wallID
 * @returns
 */
export const getWallPreview = (wallID) => {
  const qr = db.prepare('SELECT preview FROM Wall WHERE wallID=?');
  const res = qr.get(wallID);
  return res ? res.preview : undefined;
};

/**
 * Update wall preview in the database
 * @param {number} wallID
 * @param {Buffer} previewBuffer
 */
export const setWallPreview = (wallID, previewBuffer) => {
  const qr = db.prepare('UPDATE Wall SET preview=? WHERE wallID=?');
  qr.run(previewBuffer, wallID);
};

/**
 * Gets the feed for a user
 * @param {number} userID
 * @returns { {wallID: number, owner: number }[] }
 */
// eslint-disable-next-line no-unused-vars
export const getFeed = (userID) => {
  const qr = db.prepare(
    'SELECT wallID,owner,edits,likes,lastEdit,preview FROM Wall',
  );
  // later get owner from user db
  return qr.all();
};
