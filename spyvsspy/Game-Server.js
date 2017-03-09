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
		// { "Id": "1", "Directions": { "N": "2", "S": "3", "E": "4", "W": "5" }, "Colors": { "Floor": "#F5EBCD", "Wall": "#FFD79F" } }
		{ 
			"Id": "1", "Doors": { "N": { "TargetRoom": "2", "Open": false } }, "Colors": { "Floor": "#F5EBCD", "Wall": "#FFD79F" } 
		},
		{
			"Id": "2", "Doors": { "S": { "TargetRoom": "1", "Open": false } }, "Colors": { "Floor": "#BCC9E5", "Wall": "#A0B8FF" }
		}
		// 	,
		// 	{ "Id": "3", "Directions": { "N": "1", "W": "8", "E": "9" }, "Colors": { "Floor": "#DC9BBD", "Wall": "#FA74B3" } },
		// 	{ "Id": "4", "Directions": { "N": "7", "E": "1", "S": "9" }, "Colors": { "Floor": "#DB9FC0", "Wall": "#F973B2" } },
		// 	{ "Id": "5", "Directions": { "S": "8", "N": "6", "E": "1" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } },
		// 	{ "Id": "6", "Directions": { "S": "5", "E": "2" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } },
		// 	{ "Id": "7", "Directions": { "S": "4", "W": "2" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } },
		// 	{ "Id": "8", "Directions": { "N": "5", "E": "3" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } },
		// 	{ "Id": "9", "Directions": { "N": "4", "W": "3" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } }
	]
};

let state = { players: {}, template: template }

io.on('connection', function (socket) {

	let userName = '';

	socket.on('join', function (data) {

		state.players[data] = socket;
		userName = data;

		let maxRooms = template.rooms.length;

		randomRoom = Object.keys(state.players).length;

		// check if players is in game already
		state.players[data] = { Name: data, Room: randomRoom.toString() };

		console.log(data + ' registered, is in room ' + state.players[data].Room);
		console.log('Current players ' + Object.keys(state.players).length);
		socket.emit('you-joined', { template: state.template, playerData: state.players[data], players: state.players });
		socket.broadcast.emit('player-joined', { template: state.template, playerData: state.players[data], players: state.players });
	});

	socket.on('door-opened', function (data) {
		console.log(data);
		io.sockets.emit('door-opened', data);
	});

	socket.on('player-move', function (input) {

		console.log('input player-move ' + JSON.stringify(input));

		let currentRoom = state.template.rooms.filter((r) => { return r.Id === input.currentRoom })[0];
		let targetRoom = state.template.rooms.filter((r) => { return r.Id === input.targetRoom })[0];

		let fromDirection = '';
		for (let dir in currentRoom.Doors) {
			if (currentRoom.Doors[dir].TargetRoom === input.targetRoom){
				fromDirection = dir;
				currentRoom.Doors[dir].Open = true;
				console.log('opening door ' + dir + ' in room ' + currentRoom.Id);
			}
		}

		let toDirection = '';
		for (let dir in targetRoom.Doors) {
			if (targetRoom.Doors[dir].TargetRoom === input.currentRoom){
				toDirection = dir;
				targetRoom.Doors[dir].Open = true;
				console.log('opening door ' + dir + ' in room ' + targetRoom.Id);
			}
		}

		let output = {
			player: input.player, move: {
				from: { id: input.currentRoom, direction: fromDirection },
				to: { id: input.targetRoom, direction: toDirection }
			}
		};

		// console.log('output player-move ' + JSON.stringify(output));

		// console.log(input.player + ' moved to ' + input.targetRoom);
		console.log('state changed: ' + JSON.stringify(state.template.rooms));

		io.sockets.emit('player-moved', output);
	});

	socket.on('disconnect', function () {
		delete state.players[userName];
		socket.broadcast.emit('player-left', userName);
		console.log(Object.keys(state.players).length + ' players on server.');

		let keys = Object.keys(state.players);
		let combined = keys.reduce((acc, val) => { return acc + ' ' + val; }, 'Players: ');
		console.log(combined);
	});
});

http.listen(3000, function () {
	console.log('listening on localhost:3000');
});