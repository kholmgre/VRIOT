var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
	res.sendfile('Index.html');
});

// { "Id": "1", "Directions": { "N": "2" }, "Colors": { "Floor": "#F5EBCD", "Wall": "#FFD79F" } }
// ,
// { "Id": "2", "Directions": { "S": "1", "W": "3" }, "Colors": { "Floor": "#BCC9E5", "Wall": "#A0B8FF" } }
// ,
// { "Id": "3", "Directions": { "E": "2", "W": "4" }, "Colors": { "Floor": "#DC9BBD", "Wall": "#FA74B3" } },
// { "Id": "4", "Directions": { "N": "5", "E": "3" }, "Colors": { "Floor": "#DB9FC0", "Wall": "#F973B2" } },
// { "Id": "5", "Directions": { "S": "4" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } }

let template = {
	options: {
		time: '180'
	},
	rooms: [
		{ "Id": "1", "Directions": { "N": "2", "S": "3", "E": "4", "W": "5" }, "Colors": { "Floor": "#F5EBCD", "Wall": "#FFD79F" } }
		,
		{ "Id": "2", "Directions": { "W": "6", "E": "7", "S": "1" }, "Colors": { "Floor": "#BCC9E5", "Wall": "#A0B8FF" } }
		,
		{ "Id": "3", "Directions": { "N": "1", "W": "8", "E": "9" }, "Colors": { "Floor": "#DC9BBD", "Wall": "#FA74B3" } },
		{ "Id": "4", "Directions": { "N": "7", "E": "1", "S": "9" }, "Colors": { "Floor": "#DB9FC0", "Wall": "#F973B2" } },
		{ "Id": "5", "Directions": { "S": "8", "N": "6", "E": "1" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } },
		{ "Id": "6", "Directions": { "S": "5", "E": "2" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } },
		{ "Id": "7", "Directions": { "S": "4", "W": "2" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } },
		{ "Id": "8", "Directions": { "N": "5", "E": "3" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } },
		{ "Id": "9", "Directions": { "N": "4", "W": "3" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } }
	]
};

let state = { players: {}, template: template }

function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        }

io.on('connection', function (socket) {

	socket.on('join', function (data) {

		let maxRooms = template.rooms.length;

		randomRoom = getRandomInt(1, maxRooms);

		// check if exists already
		state.players[data] = { Name: data, Room: randomRoom.toString() };

		console.log(data + ' registered, is in room ' + state.players[data].Room);

		io.sockets.emit('joined', { template: state.template, playerData: state.players[data], players: state.players });
	});

	socket.on('player-move', function (data) {

		console.log(data);

		let sendData = { player: data.player, room: data.targetRoom, doorElementId: data.doorElementId };

		console.log(sendData);

		io.sockets.emit('player-moved', sendData);
	});

	socket.on('disconnect', function (socket) {
		console.log('disconnet');
	});
});

http.listen(3000, function () {
	console.log('listening on localhost:3000');
});