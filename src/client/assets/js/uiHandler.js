import Mustache from 'mustache';
import moment from "moment";

export default class UiHandler {

  // Method to handle chat button click
  static submitHandler(event, socket) {

    // Prevent page refresh
    event.preventDefault();

    const chatText = document.querySelector('#chatText');
    const chatValue = chatText.value;

    // Clear chat field
    chatText.value = '';

    // Emit "sendChat event"
    socket.emit('sendChat', chatValue, (err) => {
      if (err) {
        return console.log(err);
      }
      return;
    });

  }

  // Method to share location on socket
  static shareLocation(event, socket) {
    // Check if browser supports geolocation
    if (!('geolocation' in navigator)) {
      return alert('Browser does not support geolocation');
    }

    // Disable Share Location button
    const locationBtn = document.querySelector("#chatLocation");
    locationBtn.setAttribute('disabled', 'disabled');

    // If supported, get geolocation and emit back to server
    navigator.geolocation.getCurrentPosition(

      // Success handler: Share latitude and longitude with server
      (position) => {
        let { latitude, longitude } = position.coords;
        return socket.emit('sendLocation', { latitude, longitude }, (err) => {

          locationBtn.removeAttribute('disabled');

          if (err) {
            return console.log(err);
          }
          return;
        });
      },

      // Error handler: Alert to client that position could not be fetched
      () => {
        locationBtn.removeAttribute('disabled');
        return alert('Position not available')
      },

      // Geolocation options: Enable High Accuracy
      { enableHighAccuracy: true }
    );
  }

  static showMessage(msg) {

    // Log message to console
    console.log(msg);

    // Find tag where new message needs to be displayed
    const contentBlock = document.querySelector(".chat-received");

    // Get template from script tag in html
    const template = document.querySelector(`#message-template`).innerHTML;

    // Render html using Mustache
    const html = Mustache.render(template, {
      message: msg.text,
      createdAt: moment(msg.createdAt).format('hh:mm A')
    });

    // Append to contentBlock section
    contentBlock.insertAdjacentHTML('beforeend', html);

  }

  static showLocation(msg) {

    // Log message to console
    console.log(msg);

    // Find tag where new message needs to be displayed
    const contentBlock = document.querySelector(".chat-received");

    // Get template from script tag in html
    const template = document.querySelector(`#location-template`).innerHTML;
    console.log(template);
    console.log(msg.url);

    // Render html using Mustache
    const html = Mustache.render(template, {
      url: msg.url,
      createdAt: moment(msg.createdAt).format('hh:mm A')
    });

    // Append to contentBlock section
    contentBlock.insertAdjacentHTML('beforeend', html);

  }
}

