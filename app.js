var express = require('express');
var fs = require('fs');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var HOST = null;

// jade
//app.set('view engine', 'jade');
app.use('/public', express.static(__dirname + '/views/public/'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

server.listen(3000);
console.log('server started');

// ***** EJECUTA LOS SOCKETS! *****
require('./io')(io);