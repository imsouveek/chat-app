export default class FormHandler {

  // Method to handle chat button click
  static submitHandler(event, socket) {

    // Prevent page refresh
    event.preventDefault();

    const chatText = event.target.chatText;
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
    const locationBtn = document.querySelector('#shareLocation');
    locationBtn.setAttribute('disabled', 'disabled');

    // If supported, get geolocation and emit back to server
    navigator.geolocation.getCurrentPosition(

      // Success handler: Share latitude and longitude with server
      (position) => {
        let { latitude, longitude } = position.coords;
        return socket.emit('sendLocation', { latitude, longitude }, (err) => {

          // Sending location complete with or without errors - enable button
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
}

