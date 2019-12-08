export default class timeManipulation {
  static generateMessageObj(msg) {
    return {
      text: msg,
      createdAt: new Date().getTime(),
    }
  }

  static generateLocationObj(msg) {
    return {
      url: msg,
      createdAt: new Date().getTime(),
    }
  }
}