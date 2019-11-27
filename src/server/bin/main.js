/*
  This is the entry point for the server code. It first imports babel register
  to enable support for ES6 syntax and then imports the index file which starts
  the application and the server-side socket
*/
require('@babel/register');
require('./index');