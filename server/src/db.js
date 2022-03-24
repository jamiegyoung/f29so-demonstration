import Debug from 'debug';
import Sqlite from 'better-sqlite3';
import genPreviewBuffer from './genPreview.js';

const dbFile = 'database.db';

const debug = Debug('db');
const db = new Sqlite(dbFile);
debug(`Connected to database "${dbFile}"`);

export const init = () => {
  debug('Initializing database');
  const createTables = `
  CREATE TABLE IF NOT EXISTS Wall (
    wallID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    ownerID INTEGER NOT NULL,
    preview BLOB,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    edits INTEGER NOT NULL DEFAULT 0,
    likes INTEGER NOT NULL DEFAULT 0,
    lastEdit INTEGER NOT NULL DEFAULT (cast(strftime('%s','now') as int))
  );

  CREATE TABLE IF NOT EXISTS WallPixel (
    pixelID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    wallID INTEGER NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    color TEXT,
    FOREIGN KEY (wallID) REFERENCES Wall(wallID)
  );

  CREATE TABLE IF NOT EXISTS PixelHistory (
    historyID INTEGER NOT NULL PRIMARY KEY,
    pixelID INTEGER NOT NULL,
    FOREIGN KEY (pixelID) REFERENCES WallPixel(pixelID)
  );

  CREATE TABLE IF NOT EXISTS History (
    historyID INTEGER NOT NULL,
    userID INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    color TEXT,
    FOREIGN KEY (historyID) REFERENCES PixelHistory(historyID)
    );

  CREATE TABLE IF NOT EXISTS Likes (
    wallID INTEGER NOT NULL,
    userID INTEGER NOT NULL,
    FOREIGN KEY(wallID) REFERENCES Wall(wallID)
    FOREIGN KEY(userID) REFERENCES User(id)
  );

  CREATE TABLE IF NOT EXISTS Credentials (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    issuer TEXT NOT NULL,
    subject TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Users (
    id INTEGER NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    joined INTEGER NOT NULL DEFAULT (cast(strftime('%s','now') as int)),
    avatar BLOB,
    FOREIGN KEY(id) REFERENCES Credentials(id)
  );

  CREATE TABLE IF NOT EXISTS Follows (
    userID INTEGER NOT NULL,
    followingID INTEGER NOT NULL,
    FOREIGN KEY(userID) REFERENCES Users(id),
    FOREIGN KEY(followingID) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS UserSettings (
    userID INTEGER NOT NULL,
    privacyLevel INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(userID) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS Reports (
    wallID INTEGER NOT NULL,
    reason TEXT NOT NULL,
    FOREIGN KEY(wallID) REFERENCES Wall(wallID)
  );
`;
  db.exec(createTables);
};

export const getFollowing = (id) => {
  db.prepare('SELECT followingID FROM Follows WHERE userID = ?').all(id);
};

export const getUser = (id) =>
  db.prepare('SELECT * FROM Users WHERE id = ?').get(id);

export const getUserByUsername = (username) =>
  db.prepare('SELECT * FROM Users WHERE username = ?').get(username);

export const getUserByEmail = (email) =>
  db.prepare('SELECT * FROM Users WHERE email = ?').get(email);

export const getContributionCount = (id) =>
  db.prepare('SELECT COUNT(*) FROM History WHERE userID = ?').get(id)[
    'COUNT(*)'
  ];

export const getContributions = (id) => {
  const historyIDs = db
    .prepare('SELECT historyID FROM History WHERE userID = ?')
    .all(id)
    .map((row) => row.historyID);
  if (historyIDs.length === 0) return [];
  debug(historyIDs);
  const historyStmt = db.prepare('SELECT * FROM History WHERE historyID = ?');

  const historys = [];
  const getHistorys = db.transaction((h) => {
    h.forEach((historyID) => {
      historys.push({ ...historyStmt.get(historyID) });
    });
  });

  const pixelHistorys = [];
  getHistorys(historyIDs);
  const pixelHistoryStmt = db.prepare(
    'SELECT * FROM PixelHistory WHERE historyID = ?',
  );
  const getPixelHistory = db.transaction(() => {
    historys.forEach((history) => {
      pixelHistorys.push({
        ...history,
        ...pixelHistoryStmt.get(history.historyID),
      });
    });
  });

  getPixelHistory();

  const res = [];
  const wallPixelStmt = db.prepare('SELECT * FROM WallPixel WHERE pixelID = ?');
  const getWallPixel = db.transaction(() => {
    pixelHistorys.forEach((pixelHistory) => {
      res.push({ ...pixelHistory, ...wallPixelStmt.get(pixelHistory.pixelID) });
    });
  });
  getWallPixel();
  return res;
};

export const addCredentials = (issuer, subject) => {
  const stmt = db.prepare(
    'INSERT INTO Credentials (issuer, subject) VALUES (?, ?)',
  );
  const userID = stmt.run(issuer, subject).lastInsertRowid;
  debug(`Added user with id ${userID}`);
  return userID;
};

export const addUser = (id, username, email) => {
  const stmt = db.prepare(
    'INSERT INTO Users (id, username, email, joined) VALUES (?, ?, ?, ?)',
  );
  // Remove ms from the timestamp as it will take up a lot of space
  const res = stmt.run(id, username, email, Math.floor(Date.now() / 1000));
  if (res.changes !== 1) {
    return { error: 'Failed to add user' };
  }
  debug(`Added user with id ${id}`);
  return getUser(id);
};

/**
 * Gets the id of the user with the given credentials
 * @param {*} issuer the login service issuer e.g google or facebook
 * @param {*} subject the user's unique identifier within the issuer
 * @returns the id of the user
 */
export const getIdFromCredentials = (issuer, subject) => {
  const query = db.prepare(
    'SELECT id FROM Credentials WHERE issuer = ? AND subject = ?',
  );
  const result = query.get(issuer, subject);
  if (result) return result.id;
  return null;
};

/**
 * Get metadata for a wall
 * @param {number} wallID The wall ID
 * @returns {JSON}
 */
export const getWallMetadata = (wallID) => {
  debug('getting metadata for wall', wallID);
  const getMetadata = db.prepare(
    'SELECT ownerID,width,height,wallID,edits,likes FROM Wall WHERE wallID=?;',
  );
  return getMetadata.get(wallID);
};

export const getLikes = (wallID) => {
  debug('getting likes for wall', wallID);
  const likes = db.prepare('SELECT userID FROM Likes WHERE wallID=?;');
  return likes.all(wallID);
};

// eslint-disable-next-line no-unused-vars
export const addLike = (wallID, _uid) => {
  debug(`adding like to wall ${wallID}`);
  // will have to get if the user exists when they have been implemented
  // check if the user has already liked the wall
  // uncomment when users are implemented
  /*
  const hasLiked = db.prepare(
    'SELECT * FROM Likes WHERE wallID=? AND userID=?;',
  );
  const hasLikedResult = hasLiked.get(wallID, uid);
  if (hasLikedResult) {
    return;
  }
  */
  const insertLike = db.prepare(
    'INSERT INTO Likes (wallID, userID) VALUES (?, ?);',
  );
  const updateLikes = db.prepare(
    'UPDATE Wall SET likes=likes+1 WHERE wallID=?;',
  );
  const add = db.transaction(() => {
    insertLike.run(wallID, 1);
    updateLikes.run(wallID);
  });

  add();
};

export const updateWallMetadata = (wallID, metadata) => {
  debug('Updating metadata for wall', wallID);
  const updateMetadata = db.prepare(
    'UPDATE Wall SET width=?,height=?,lastEdit=?,edits=? WHERE wallID=?;',
  );
  updateMetadata.run(
    metadata.width,
    metadata.height,
    metadata.lastEdit / 1000,
    metadata.edits,
    wallID,
  );
};

export const getAllWallMetadatas = () => {
  debug('Getting all wall metadata');
  const qr = db.prepare('SELECT ownerID,width,height,wallID FROM Wall;');
  return qr.all();
};

export const getHistoryIDs = (pixelID) => {
  const qr = db.prepare('SELECT historyID FROM PixelHistory WHERE pixelID=?;');
  return qr.all(pixelID);
};

/**
 * Get the pixels for a wall
 * @param {number} wallID The wall ID
 * @returns {JSON}
 */
export const getWallPixels = (wallID) => {
  debug('Getting pixels for wallID', wallID);
  const getPixels = db.prepare(
    'SELECT pixelID,x,y,color FROM WallPixel WHERE wallID=?;',
  );
  const pixels = getPixels.all(wallID);
  const history = db.prepare(
    'SELECT historyID,userID,timestamp,color FROM History WHERE historyID=?;',
  );

  const qPixelHistory = db.transaction(() => {
    pixels.map((px) => {
      const historyIDs = getHistoryIDs(px.pixelID);
      const historyResult = historyIDs
        .map((id) => history.get(id.historyID))
        .filter((res) => res)
        .map((h) => {
          const user = getUser(h.userID);
          return {
            ...h,
            username: user ? user.username : 'Anonymous',
          };
        });
      const newPx = px;
      // change the userID to username
      newPx.history = historyResult;
      return px;
    });
  });

  qPixelHistory();
  return pixels;
};

export const updatePreview = (wallID, buffer) => {
  debug('Updating preview for wall', wallID);
  const qr = db.prepare('UPDATE Wall SET preview=? WHERE WallID=?');
  qr.run(buffer, wallID);
};

/**
 * Create a new wall
 * @param {string} ownerID
 * @param {number} width
 * @param {number} height
 */
export const createWall = async (ownerID, width, height) => {
  debug('Creating new wall');
  const createWallQr = db.prepare(
    'INSERT INTO Wall(ownerID,width,height) VALUES (?,?,?);',
  );

  const { lastInsertRowid: wallID } = createWallQr.run(ownerID, width, height);

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

  const insertHistoryID = db.prepare(
    'INSERT INTO PixelHistory(pixelID) VALUES (?);',
  );

  const insertAllPixels = db.transaction((pixels) => {
    pixels.forEach((pixel) => {
      const { lastInsertRowid: pixelID } = insertPixel.run(
        pixel.wallID,
        pixel.x,
        pixel.y,
        pixel.color,
      );
      insertHistoryID.run(pixelID);
    });
  });

  insertAllPixels(pixelArray);
  updatePreview(wallID, await genPreviewBuffer(width, height, pixelArray));
  // Should return something to show if successful
};

export const getPixelHistory = (pixelID) => {
  debug('Getting history for pixel', pixelID);
  const ids = getHistoryIDs(pixelID);
  const history = db.prepare(
    'SELECT userID,timestamp,color FROM History WHERE historyID=?;',
  );
  const qr = db.transaction((historyIDs) => {
    historyIDs.forEach((id) => {
      const historyResult = history.run(id.historyID);
      ids.find((i) => i.historyID === id.historyID).history = historyResult;
    });
  });
  qr(ids);
  return ids;
};

export const updatePixel = (pixel) => {
  debug('Updating pixel', pixel);
  const updatePixelQr = db.prepare(
    'UPDATE WallPixel SET color=? WHERE pixelID=?;',
  );
  const insertPixelHistory = db.prepare(
    'INSERT INTO PixelHistory(pixelID) VALUES (?);',
  );

  const insertHistory = db.prepare(
    'INSERT INTO History(historyID,userID,timestamp,color) VALUES (?,?,?,?);',
  );

  updatePixelQr.run(pixel.color, pixel.pixelID);
  const oldHistory = getPixelHistory(pixel.pixelID);
  const filteredOldHistory = pixel.history.filter(
    (h) => !oldHistory.find((oh) => oh.historyID === h.historyID),
  );

  filteredOldHistory.forEach((history) => {
    const { lastInsertRowid: historyID } = insertPixelHistory.run(
      pixel.pixelID,
    );
    insertHistory.run(
      historyID,
      history.userID,
      history.timestamp,
      history.color,
    );
  });
};

/**
 * Set specific pixels on a wall
 *
 * TODO: Add history stuff
 * @param {number} wallID Wall ID
 * @param {number} x
 * @param {number} y
 * @param {string} color Hex string (format: RRGGBBAA)
 * @param {string} user Not currently used
 */
export const updatePixels = (wallID, pixels) => {
  debug('Updating pixels for wall', wallID);
  if (!pixels) return;

  const updateAllPixels = db.transaction((pxs) => {
    pxs.forEach((pixel) => {
      updatePixel(pixel);
    });
  });

  updateAllPixels(pixels);
};

/**
 * Get all wall IDs
 * @returns {number[]}
 */
export const getAllWallIDs = () => {
  debug('Getting all wall IDs');
  const qr = db.prepare('SELECT wallID FROM Wall;');
  return qr.all().map((v) => v.wallID);
};

/**
 * Get the preview PNG for a wall
 * @param {number} wallID
 * @returns
 */
export const getWallPreview = (wallID) => {
  debug('Getting preview for wall', wallID);
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
  debug('Setting preview for wall', wallID);
  const qr = db.prepare('UPDATE Wall SET preview=? WHERE wallID=?');
  qr.run(previewBuffer, wallID);
};

/**
 * Gets the feed for a user
 * @param {number} userID
 * @returns { {wallID: number, ownerID: number }[] }
 */
// eslint-disable-next-line no-unused-vars
export const getFeed = (userID) => {
  debug('Getting feed for user', userID);
  const qr = db.prepare(
    'SELECT wallID,ownerID,edits,likes,lastEdit,preview FROM Wall',
  );
  // later get owner from user db
  return qr.all();
};
