const debug = require('debug')('walls-socket');

const connectedWalls = {};

const addConnectedWall = (socket, wallID) => {
  // if the wall doesn't exist, create it
  if (!connectedWalls[wallID]) {
    connectedWalls[wallID] = [socket.id];
    return;
  }
  // add the socket to the wall's connected sockets
  connectedWalls[wallID].push(socket.id);
};

module.exports = (io) => {
  const wallsNamespace = io.of('/walls');

  wallsNamespace.on('connection', (socket) => {
    const wallID = socket.handshake.query.wall;
    if (!wallID) {
      socket.emit('error', 'No wall ID provided');
      return;
    }

    socket.on('disconnect', () => {
      debug(`${socket.id} disconnected from wall ${wallID}`);
      // Remove the socket from the wall's connected sockets
      connectedWalls[wallID] = connectedWalls[wallID].filter(
        (id) => id !== socket.id,
      );
      // Delete the wall room if no one is connected
      if (connectedWalls[wallID].length === 0) {
        delete connectedWalls[wallID];
      }
    });

    socket.join(wallID);
    socket.send(`connected to wall ${wallID}`);
    debug(`${socket.id} connected to wall ${wallID}`);

    addConnectedWall(socket, wallID);
  });
};
