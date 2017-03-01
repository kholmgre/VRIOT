var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
	res.sendfile('index.html');
});

io.on('connection', function (socket) {
	socket.on('register', function (data) {
		console.log(data + ' registered');
		io.emit('newPlayer', data);
	});

	socket.on('movement', function (data) {
		io.emit('playerMoved', data);
	});

	socket.on('disconnect', function (socket) {
		io.sockets.emit('broadcast', { description: socket });
	});
});

http.listen(3000, function () {
	console.log('listening on localhost:3000');
});