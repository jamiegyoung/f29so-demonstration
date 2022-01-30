import Debug from 'debug';
import { updatePixels, getWallMetadata, getWallPixels } from './db.js';

const debug = Debug('walls');

const connectedSockets = {};
const wallChanges = {};

const addConnectedWall = (socket, wallID) => {
  // if the wall doesn't exist, create it
  if (!connectedSockets[wallID]) {
    connectedSockets[wallID] = [socket.id];
    return;
  }
  // add the socket to the wall's connected sockets
  connectedSockets[wallID].push(socket.id);
};

const saveChanges = (wallID) => {
  if (wallChanges[wallID]) {
    console.log('saving changes');
    // save the changes to the database
    updatePixels(wallID, wallChanges[wallID]);
  }
};

const addWallChange = (wallID, change) => {
  // if the wall doesn't exist, create it
  if (!wallChanges[wallID]) {
    wallChanges[wallID] = [change];
    return;
  }
  wallChanges[wallID].push(change);
  if (wallChanges[wallID].length > 99) {
    saveChanges(wallID);
    wallChanges[wallID] = [];
  }
};

const applyWallChanges = (wall) => {
  if (!wallChanges[wall.wallID]) {
    return wall;
  }
  const newWall = wall;
  newWall.pixels = wall.pixels.map(
    (pixel) =>
      wallChanges[wall.wallID].find(
        (change) => change.x === pixel.x && change.y === pixel.y,
      ) || pixel,
  );
  return newWall;
};

export default (io) => {
  const wallsNamespace = io.of('/walls');

  wallsNamespace.on('connection', (socket) => {
    const wallID = socket.handshake.query.wall;
    if (!wallID) {
      socket.emit('error', 'No wall ID provided');
      return;
    }

    socket.join(wallID);
    socket.send(`connected to wall ${wallID}`);
    debug(`${socket.id} connected to wall ${wallID}`);

    addConnectedWall(socket, wallID);

    const data = getWallMetadata(wallID);
    if (!data) {
      socket.emit('error', 'Wall not found');
      return;
    }
    const pixels = getWallPixels(wallID);

    data.pixels = pixels;
    const changedWall = applyWallChanges(data);

    socket.emit('connected', changedWall);

    socket.on('pixel-edit', (pixel) => {
      const newColor = pixel.color;
      const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
      if (!hexRegex.test(newColor)) {
        socket.emit('error', 'Invalid color');
      }
      const newPixel = pixel;
      newPixel.history = [
        {
          editor: socket.id,
          timestamp: Date.now(),
          color: pixel.color,
        },
      ];
      wallsNamespace.to(wallID).emit('pixel-edit', newPixel);
      addWallChange(wallID, newPixel);
    });

    socket.on('disconnect', () => {
      debug(`${socket.id} disconnected from wall ${wallID}`);
      // Remove the socket from the wall's connected sockets
      connectedSockets[wallID] = connectedSockets[wallID].filter(
        (id) => id !== socket.id,
      );
      // Delete the wall room if no one is connected
      if (connectedSockets[wallID].length === 0) {
        delete connectedSockets[wallID];
        saveChanges(wallID);
        delete wallChanges[wallID];
      }
      debug('connectedSockets: ', connectedSockets);
    });
  });
};
