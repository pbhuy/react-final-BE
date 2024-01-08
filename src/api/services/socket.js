const socketIO = require('socket.io');
let io; // Socket.IO instance
const jwt = require('jsonwebtoken'); // If using JWT for user authentication

const getUserIdFromSocket = (socket) => {
  // Extract the token from the query parameters or headers
  const token = socket.handshake.query.token; // Example: ?token=<JWT_TOKEN>

  console.log(token);

  // // Decode the token to obtain user information
  const decodedToken = jwt.decode(token);

  console.log('decodedToken ', decodedToken);
  // // Extract the user ID from the decoded token
  const userId = decodedToken ? decodedToken._id : null;

  return userId;
};

const configureSocket = (server) => {
  if (!io) {
    if (!io) {
      io = socketIO(server, {
        transports: ['websocket', 'polling'], // Include 'websocket' as a supported transport
        cors: {
          origin: '*',
        },
      });

      io.on('connection', (socket) => {
        console.log('A user connected');

        const userId = getUserIdFromSocket(socket);
        console.log(userId);

        // Join a room based on the user ID
        socket.join(userId);

        // Emit a welcome message to the connected user
        // io.to(userId).emit('welcome', { message: `Welcome, ${userId}!` });

        socket.on('disconnect', () => {
          console.log('User disconnected');
        });
      });
    }
    return io;
  }

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

module.exports = {
  configureSocket,
  getIO,
};
