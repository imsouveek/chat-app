export default class FormHandler {

  // Method to handle chat button click
  static submitHandler(event, socket) {

    // Prevent page refresh
    event.preventDefault();

    // Emit "sendChat event"
    const chatText = event.target.chatText;
    socket.emit('sendChat', chatText.value);

    // Clear chat field
    chatText.value = '';
  }

  // Method to share location on socket
  static shareLocation(socket) {
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
  }
}

