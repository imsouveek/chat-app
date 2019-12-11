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

    // Find tag where new message needs to be displayed
    const contentBlock = document.querySelector(".chat-received");

    // Get template from script tag in html
    const template = document.querySelector(`#message-template`).innerHTML;

    // Render html using Mustache
    const html = Mustache.render(template, {
      username: msg.username,
      message: msg.text,
      createdAt: moment(msg.createdAt).format('hh:mm A')
    });

    // Append to contentBlock section
    contentBlock.insertAdjacentHTML('beforeend', html);

    // Autoscroll
    UiHandler.autoscroll();

  }

  static showLocation(msg) {

    // Find tag where new message needs to be displayed
    const contentBlock = document.querySelector(".chat-received");

    // Get template from script tag in html
    const template = document.querySelector(`#location-template`).innerHTML;

    // Render html using Mustache
    const html = Mustache.render(template, {
      username: msg.username,
      url: msg.url,
      createdAt: moment(msg.createdAt).format('hh:mm A')
    });

    // Append to contentBlock section
    contentBlock.insertAdjacentHTML('beforeend', html);

    // Autoscroll
    UiHandler.autoscroll();

  }

  static handleUpdatedMeta(username, {room, users}) {

    // "users" list only has lowercase usernames, so convert username
    username = username.trim().toLowerCase();

    // Find user in results
    const idx = users.findIndex(
      (obj) => obj.username === username
    );

    // Put current user at top of users list
    const thisUser = users.splice(idx, 1);
    users.unshift(thisUser[0]);

    // Render users
    const template = document.querySelector(`#sidebar-template`).innerHTML;
    const html = Mustache.render(template, {room, users});
    const sidebarBlock = document.querySelector('.sidebar');
    sidebarBlock.innerHTML = html;
  }

  static autoscroll() {

    // Get last chat message
    const messages = document.querySelector(".chat-received");
    const newMessage = messages.lastElementChild;

    // Height measurements
    const newMarginStyles = getComputedStyle(newMessage);
    const newMessageHeight = newMessage.offsetHeight;

    // Scrollbar is being created on html element
    const main = document.querySelector('html');

    // Container height
    const headerHeight = document.querySelector('.header').offsetHeight;
    const mainHeight = document.querySelector('.main').offsetHeight;
    const visibleHeight = headerHeight + mainHeight;

    // Visible height - screen realestate
    const containerHeight = document.querySelector('.sidebar').offsetHeight;

    // How far have I scrolled
    const scrollOffset = main.scrollTop + containerHeight;

    // If I have scrolled away from bottom, don't autoscroll
    if (visibleHeight - newMessageHeight <= scrollOffset) {
      newMessage.scrollIntoView();
    }

  }
}

