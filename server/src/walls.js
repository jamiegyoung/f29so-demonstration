import Debug from 'debug';
import {
  updateWallMetadata,
  getWallMetadata,
  getWallPixels,
  updatePreview,
  updatePixel,
  getUser,
} from './db.js';
import genPreviewBuffer from './genPreview.js';

const debug = Debug('walls');

const connectedSockets = {};
const wallChanges = {};

const addConnectedWall = (userID, wallID) => {
  // if the wall doesn't exist, create it
  if (!connectedSockets[wallID]) {
    connectedSockets[wallID] = [userID];
    return;
  }
  // add the socket to the wall's connected sockets
  connectedSockets[wallID].push(userID);
};

const updateWallPreview = async (wallID) => {
  const metadata = getWallMetadata(wallID);
  const pixels = getWallPixels(wallID);
  updatePreview(
    wallID,
    await genPreviewBuffer(metadata.width, metadata.height, pixels),
  );
};

const addWallChange = (wallID, pixel) => {
  updatePixel(pixel);
  const wallMetadata = getWallMetadata(wallID);
  const newWallMetadata = {
    ...wallMetadata,
    lastEdit: Date.now(),
    edits: wallMetadata.edits + 1,
  };
  updateWallMetadata(wallID, newWallMetadata);
  // if the wall doesn't exist, create it
  if (!wallChanges[wallID]) {
    wallChanges[wallID] = 1;
    return;
  }
  wallChanges[wallID] += 1;
  if (wallChanges[wallID] > 99) {
    updateWallPreview(wallID);
    wallChanges[wallID] = 0;
  }
};

export default (io, sessionMiddleware) => {
  const wallsNamespace = io.of('/walls');

  wallsNamespace
    .use((socket, next) => {
      sessionMiddleware(socket.request, {}, next);
    })
    .on('connection', (socket) => {
      if (
        !socket.request.session.passport ||
        !socket.request.session.passport.user
      ) {
        socket.disconnect();
        return;
      }
      const userID = socket.request.session.passport.user;

      const wallID = socket.handshake.query.wall;

      if (!wallID) {
        socket.emit('error', 'No wall ID provided');
        return;
      }

      socket.join(wallID);
      socket.send(`connected to wall ${wallID}`);
      debug(`${userID} connected to wall ${wallID}`);

      addConnectedWall(userID, wallID);

      const data = getWallMetadata(wallID);
      if (!data) {
        socket.emit('error', 'Wall not found');
        return;
      }
      const pixels = getWallPixels(wallID);
      // console.log(pixels);
      data.pixels = pixels;

      socket.emit('connected', data);

      socket.on('pixel-edit', (pixel) => {
        const newColor = pixel.color;
        const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
        if (!hexRegex.test(newColor)) {
          socket.emit('error', 'Invalid color');
        }
        debug(newColor);
        if (wallChanges[wallID] && wallChanges[wallID][0]) {
          if (wallChanges[wallID][0].color === newColor) {
            socket.emit('error', 'No change');
            return;
          }
        }
        const newUser = getUser(userID);
        if (!newUser) {
          socket.emit('error', 'User not found');
          return;
        }
        const newPixel = {
          ...pixel,
          history: [
            {
              userID,
              username: newUser.username,
              timestamp: Date.now(),
              color: pixel.color,
            },
          ],
        };

        wallsNamespace.to(wallID).emit('pixel-edit', newPixel);
        addWallChange(wallID, newPixel);
      });

      socket.on('disconnect', () => {
        debug(`${userID} disconnected from wall ${wallID}`);
        // Remove the socket from the wall's connected sockets
        connectedSockets[wallID] = connectedSockets[wallID].filter(
          (id) => id !== userID,
        );
        // Delete the wall room if no one is connected
        if (connectedSockets[wallID].length === 0) {
          delete connectedSockets[wallID];
          updateWallPreview(wallID);
          delete wallChanges[wallID];
        }
        debug('connectedSockets: ', connectedSockets);
      });
    });
};
