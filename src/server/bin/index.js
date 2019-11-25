/*
  Load and start server. The idea with this script is to ensure that all
  application logic, including definition of server and routes, is completely
  independent of the script that actually starts the server
*/

/*
  Relying on node http module for server. This is what express-generator
  does and it allows us to easily move from http to https with few changes
*/
import { createServer } from 'http';

// Load Application entry point
import app from '../app';

// Load Websocket support
import socketio from 'socket.io';

// Create Server and enable Websocket
const server = createServer(app);
const io = socketio(server);

// Handle Websocket events
io.on('connection', () => {
  console.log('New connection');
})

// Identify port and start Server
const port = process.env.PORT;
server.listen(port);

// Error handling
server.on('error', (err) => console.log(err));
server.on('listening', () => {
  console.log(`Server listening on port ${port}`);
});
