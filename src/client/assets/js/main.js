/*
  Include css and pug files that this javascript needs to attach to. This will
  enable include these files to the generated html automatically and also enable
  hot-reloading of css / pug files in webpack dev server
*/
require('../css/styles.css');
require('../../templates/views/index.pug');

/*
  The core javascript. This enables the websocket programming that is needed
  to enable the chat functionality
*/
import io from 'socket.io-client';

// Create a socket
const socket = io();

// Handler for "message" event on socket
socket.on('message', (messageStr) => {
  console.log(messageStr);
});

// Handler for "newChat" event on socket
socket.on('newChat', (msg) => {
  console.log(`New chat ${msg}`);
});

// Form event handler
document.querySelector('#chatForm').addEventListener('submit', (event) => {

  // Prevent page refresh
  event.preventDefault();

  // Emit "sendChat event"
  const chatText = event.target.chatText;
  socket.emit('sendChat', chatText.value);

  // Clear chat field
  chatText.value = '';
});
