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

// Handler for "newLocation" event
socket.on('newLocation', (msg) => {
  console.log(`New shared location: ${msg}`);
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

// Button event handler
document.querySelector('#shareLocation').addEventListener('click', (event) => {

  // Check if browser supports geolocation
  if (!('geolocation' in navigator)) {
    return alert('Browser does not support geolocation');
  }

  // If supported, get geolocation and emit back to server
  navigator.geolocation.getCurrentPosition(

    // Success handler: Share latitude and longitude with server
    (position) => {
      let { latitude, longitude } = position.coords;
      return socket.emit('sendLocation', { latitude, longitude });
    },

    // Error handler: Alert to client that position could not be fetched
    () => alert('Position not available'),

    // Geolocation options: Enable High Accuracy
    { enableHighAccuracy: true }
  );
});