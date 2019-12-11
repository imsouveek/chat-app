export default class msgHandler {
  static generateMessageObj(username, text) {
    return {
      username,
      text,
      createdAt: new Date().getTime(),
    }
  }

  static generateLocationObj(username, url) {
    return {
      username,
      url,
      createdAt: new Date().getTime(),
    }
  }
}