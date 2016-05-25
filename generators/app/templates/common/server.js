#!/usr/bin/env node

var app = require('./app');
var http = require('http');
var server;


server = http.createServer(app);

server.listen(app.get('port'), function (err) {
  if (err) {
    console.error(err);
    err.stack && console.error(err.stack);
    return;
  }

  console.log('Server started at localhost:' + server.address().port + '(' + server.address().address + ')');
});
