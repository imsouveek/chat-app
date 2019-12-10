// User Management
export default class users {
  constructor() {
    this.users = [];
  }

  addUser({ id, username, room }) {
    // Sanitize input
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Check that values are passed
    if (!username || !room) {
      return {
        error: "Username and room are required"
      };
    }

    // Check that username is unique within a room
    const existingUser = this.users.find((obj) => {
      return obj.username === username && obj.room === room
    });

    if (existingUser) {
      return {
        error: "Username already in use"
      }
    }

    // Add user
    const user = { id, username, room };
    this.users.push(user);
    return {
      user
    };

  }

  removeUser (id) {
    // Get index of id in array
    const idx = this.users.findIndex(
      (obj) => obj.id === id
    );

    // Check that user was found
    if (idx === -1) {
      return {
        error: "No user found"
      };
    }

    // If user found, splice from array and return result
    const result = this.users.splice(idx, 1);
    const user = result[0];

    return { user };

  }

  getUser(id) {

    // Find user in array
    const user = this.users.find(
      (obj => obj.id === id)
    );

    // If user found, return user
    if (user) {
      return { user };
    } else {

      // Else, throw error
      return {
        error: 'No user found'
      };
    }
  }

  getUsersinRoom(room) {

    // Convert input to lowercase and trim
    room = room.trim().toLowerCase();

    // Get list of users in specific room
    const result = this.users.filter(
      (obj) => obj.room === room
    );

    return result;
  }
}
