var express = require('express');
var fs = require('fs');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var PORT = 3000;

var view = 'snake';
var title = 'JGF - Snake';

// ***** IMPORTA EL MOTOR JADE *****
app.set('view engine', 'jade');

// ***** RUTAS Y ARRANQUE DEL SERVIDOR *****
app.use('/public', express.static(__dirname + '/views/public/'));

app.get('/', function (req, res) {
    res.render(view, {title: title});
});

server.listen(PORT);
console.log('escoltant pel port ' + PORT);

// ***** EJECUTA LOS SOCKETS! *****
require('./io')(io);