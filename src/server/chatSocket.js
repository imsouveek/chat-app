// Load Websocket support
import socketio from 'socket.io';

export default class chatSocket {
  constructor(server) {
    const io = socketio(server);

    // Handle Websocket events
    io.on('connection', (socket) => {

      /*
        When there is new connection event, emit message back to client. Also
        emit information to other users about new joined user
      */
      socket.emit('message', 'Welcome!');
      socket.broadcast.emit('message', 'A new user has joined');

      // Broadcast "newChat" event when any client socket triggers "sendChat"
      socket.on('sendChat', (value) => {
        io.emit('newChat', value);
      });

      // When a user disconnects, broadcast information to other users
      socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
      })
    });
  }
}