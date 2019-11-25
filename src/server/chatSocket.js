// Load Websocket support
import socketio from 'socket.io';

export default class chatSocket {
  constructor(server) {
    const io = socketio(server);

    // Handle Websocket events
    io.on('connection', (socket) => {
      socket.emit('message', 'Welcome!');
      socket.broadcast.emit('message', 'A new user has joined');

      socket.on('sendChat', (value) => {
        io.emit('newChat', value);
      });

      socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
      })
    });
  }
}