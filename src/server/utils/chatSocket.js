// Load Websocket support
import socketio from 'socket.io';
import Users from './users';
import TimeManipulation from './timeManipulation';

export default class chatSocket {
  constructor(server) {
    const users = new Users();
    const io = socketio(server);

    // Handle Websocket events
    io.on('connection', (socket) => {

      // Handle join event
      socket.on('join', ({username, room}, callback) => {

        // Try to add user
        const {error, user} = users.addUser({
          id: socket.id,
          username,
          room
        });

        // If error, stop
        if (error) {
          return callback(error);
        }
        socket.join(user.room);

        // Send welcome message and inform other users that this user has joined
        socket
          .emit(
            'message',
            TimeManipulation.generateMessageObj('Welcome!')
          );
        socket
          .broadcast
          .to(user.room)
          .emit(
            'message',
            TimeManipulation.generateMessageObj(`${user.username} has joined`)
          );

        callback();
      });


      // Broadcast "newChat" event when any client socket triggers "sendChat"
      socket.on('sendChat', (value, callback) => {

        // Try to get user
        const {error, user} = users.getUser(socket.id);

        if (!error) {
          // Send message to room only if we can fetch users successfully
          io
            .to(user.room)
            .emit(
              'newChat',
              TimeManipulation.generateMessageObj(value)
            );
        }
        callback();
      });

      // Broadcast "newLocation" event when any client socket triggers "sendLocation"
      socket.on('sendLocation', (position, callback) => {

        // Try to get user
        const {error, user} = users.getUser(socket.id);

        if (!error) {

          // Send message to room only if we can fetch users successfully
          io
            .to(user.room)
            .emit(
              'newLocation',
              TimeManipulation.generateLocationObj(
                `https://google.com/maps?q=${position.latitude},${position.longitude}`
              )
            );
        }
        callback();
      });

      // When a user disconnects, broadcast information to other users
      socket.on('disconnect', () => {
        // Try to remove user
        const {error, user} = users.removeUser(socket.id);

        if (!error) {
          // Send message to room only if user is removed successfully
          io
            .to(user.room)
            .emit(
              'message',
              TimeManipulation.generateMessageObj(`${user.username} has left`
            )
          );
        }
      });
    });
  }
}