var express = require('express');
var fs = require('fs');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var PORT = 3000;

// ***** IMPORTA EL MOTOR JADE *****
app.set('view engine', 'jade');

// ***** RUTAS Y ARRANQUE DEL SERVIDOR *****
app.use('/public', express.static(__dirname + '/views/public/'));

app.get('/', function (req, res) {
    //res.sendFile(__dirname + '/views/index.html');
    res.render('snake', {title: 'JGF - Snake'});
});

server.listen(PORT);
console.log('escoltant pel port ' + PORT);

// ***** EJECUTA LOS SOCKETS! *****
require('./io')(io);