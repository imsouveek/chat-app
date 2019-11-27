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

// Import chatsocket class
import chatSocket from '../chatSocket';

// Create Server and enable Websocket
const server = createServer(app);

// Enable chatSocket
new chatSocket(server);

// Identify port and start Server
const port = process.env.PORT;
server.listen(port);

// Error handling
server.on('error', (err) => console.log(err));
server.on('listening', () => {
  console.log(`Server listening on port ${port}`);
});
