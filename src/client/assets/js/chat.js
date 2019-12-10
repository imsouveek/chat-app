/*
  Include css and pug files that this javascript needs to attach to. This will
  enable include these files to the generated html automatically and also enable
  hot-reloading of css / pug files in webpack dev server
*/
require('../scss/index.scss');
require('../../templates/views/chat.pug');

/*
  The core javascript. This enables the websocket programming that is needed
  to enable the chat functionality
*/
import io from 'socket.io-client';
import UiHandler from './uiHandler';
import Qs from 'qs';

// Get query parameters
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// Create a socket
const socket = io();

// Handler for "message" event on socket
socket.on('message', (msg) => UiHandler.showMessage(msg));

// Handler for "newChat" event on socket
socket.on('newChat', (msg) => UiHandler.showMessage(msg));

// Handler for "newLocation" event
socket.on('newLocation', (msg) => UiHandler.showLocation(msg));

// Use helper class to handle form "submit" event
document
  .querySelector('#chatSend')
  .addEventListener('click', (event) => UiHandler.submitHandler(event, socket));

// Use helper class to handle button "click" event
document
  .querySelector('#chatLocation')
  .addEventListener('click', (event) => UiHandler.shareLocation(event, socket));

// Send join event to server on page load
socket.emit('join', {username, room}, (err) => {
  if (err) {
    alert(err);
    window.location.replace('/');

  }
})