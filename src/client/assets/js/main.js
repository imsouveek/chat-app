require('../css/styles.css');
require('../../templates/views/index.pug');

import io from 'socket.io-client';

const socket = io();

socket.on('message', (messageStr) => {
  console.log(messageStr);
});

socket.on('newChat', (msg) => {
  console.log(`New chat ${msg}`);
});

document.querySelector('#chatForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const chatText = event.target.chatText;
  socket.emit('sendChat', chatText.value);
  chatText.value = '';
})