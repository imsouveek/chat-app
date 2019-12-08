// Load Websocket support
import socketio from 'socket.io';
import TimeManipulation from './timeManipulation';

export default class chatSocket {
  constructor(server) {
    const io = socketio(server);

    // Handle Websocket events
    io.on('connection', (socket) => {

      /*
        When there is new connection event, emit message back to client. Also
        emit information to other users about new joined user
      */
      socket.emit('message', TimeManipulation.generateMessageObj('Welcome!'));
      socket.broadcast.emit(
        'message',
        TimeManipulation.generateMessageObj('A new user has joined')
      );

      // Broadcast "newChat" event when any client socket triggers "sendChat"
      socket.on('sendChat', (value, callback) => {
        io.emit('newChat', TimeManipulation.generateMessageObj(value));
        callback();
      });

      // Broadcast "newLocation" event when any client socket triggers "sendLocation"
      socket.on('sendLocation', (position, callback) => {
        io.emit(
          'newLocation',
          TimeManipulation.generateLocationObj(
            `https://google.com/maps?q=${position.latitude},${position.longitude}`
          )
        );
        callback();
      });

      // When a user disconnects, broadcast information to other users
      socket.on('disconnect', () => {
        io.emit('message', TimeManipulation.generateMessageObj('A user has left'))
      })
    });
  }
}