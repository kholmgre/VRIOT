import { Player } from '../player';
import { GameState, MapTemplate } from '../gameState';
import { JoinGameCommand, OpenDoorCommand, PlayerMoveCommand } from '../commands/commands';
import { DoorOpened, PlayerChangedRoom, YouJoined } from '../events/events';
import { Room } from '../rooms';

const express = require('express');
const app = express();
const server = app.listen('3000');

const io = require('socket.io').listen(server);
io.set('origins', '*:*');

let room = new Room("1");
room.id = "1";
room.floor = { color: '#F5EBCD' };
room.roof = { color: '#F5EBCD' };
room.setWallColors('#FFD79F');


const template = new MapTemplate([room]);

const currentGames: Array<GameState> = [];

const connectedPlayers: Array<{ socket: any, playerId: string }> = [];

// {
// 	options: {
// 		time: '180'
// 	},
// 	rooms: [
// 		// { "Id": "1", "Directions": { "N": "2", "S": "3", "E": "4", "W": "5" }, "Colors": { "Floor": "#F5EBCD", "Wall": "#FFD79F" } }
// 		{ 
// 			// "Id": "1", "Doors": { "N": { "TargetRoom": "2", "Open": false } }, "Colors": { "Floor": "#F5EBCD", "Wall": "#FFD79F" } 
// 			"Id": "1", "Doors": {  }, "Colors": { "Floor": "#F5EBCD", "Wall": "#FFD79F" } 
// 		}
// 		// ,
// 		// {
// 		// 	"Id": "2", "Doors": { "S": { "TargetRoom": "1", "Open": false } }, "Colors": { "Floor": "#BCC9E5", "Wall": "#A0B8FF" }
// 		// }
// 		// 	,
// 		// 	{ "Id": "3", "Directions": { "N": "1", "W": "8", "E": "9" }, "Colors": { "Floor": "#DC9BBD", "Wall": "#FA74B3" } },
// 		// 	{ "Id": "4", "Directions": { "N": "7", "E": "1", "S": "9" }, "Colors": { "Floor": "#DB9FC0", "Wall": "#F973B2" } },
// 		// 	{ "Id": "5", "Directions": { "S": "8", "N": "6", "E": "1" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } },
// 		// 	{ "Id": "6", "Directions": { "S": "5", "E": "2" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } },
// 		// 	{ "Id": "7", "Directions": { "S": "4", "W": "2" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } },
// 		// 	{ "Id": "8", "Directions": { "N": "5", "E": "3" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } },
// 		// 	{ "Id": "9", "Directions": { "N": "4", "W": "3" }, "Colors": { "Floor": "#F2FBD0", "Wall": "#E4FCA4" } }
// 	]
// };

io.on('connection', function (socket: any) {

	// Mutable "session" data
	const userName = '';
	let playerId = '';
	let currentGameId = '';

	console.log('player joined!');

	socket.on('join', function (data: JoinGameCommand) {

		console.log('player joining game ' + JSON.stringify(data));

		let gameToJoin: GameState = null;

		if (currentGames.length === 0) {
			gameToJoin = new GameState(template);
			currentGames.push(gameToJoin);
		} else {
			gameToJoin = currentGames.find((g: GameState) => { return g.players.length > 0 });
		}

		const newPlayer = new Player(data.playerName);
		playerId = newPlayer.id;

		connectedPlayers.push({ playerId: newPlayer.id, socket: socket });

		gameToJoin.addPlayer(newPlayer);

		currentGameId = gameToJoin.id;

		const youJoined = new YouJoined();
		youJoined.gameState = gameToJoin;
		youJoined.playerId = newPlayer.id;

		socket.emit('you-joined', youJoined);
		socket.broadcast.emit('player-joined', newPlayer);
	});

	socket.on('door-opened', function (data: DoorOpened) {
		io.sockets.emit('door-opened', data);
	});

	socket.on('player-move', function (input: PlayerMoveCommand) {
		console.log(JSON.stringify(input));
		io.sockets.emit('player-move', input);
	});

	function findDirection(room: Room, command: DoorOpened): string {
		let direction = '';
		if (room.doors["E"].targetRoom === command.targetId) {
			room.doors["E"].open = true;
			direction = "E";
		} else if (room.doors["N"].targetRoom === command.targetId) {
			room.doors["N"].open = true;
			direction = "N";
		} else if (room.doors["S"].targetRoom === command.targetId) {
			room.doors["S"].open = true;
			direction = "S";
		} else if (room.doors["W"].targetRoom === command.targetId) {
			room.doors["W"].open = true;
			direction = "W";
		}

		return direction;
	}

	socket.on('player-change-room-command', function (command: OpenDoorCommand) {

		const currentGame = currentGames.find((g: GameState) => { return g.id === currentGameId });

		if (currentGame === undefined)
			throw 'Non existing game';

		const currentRoom = currentGame.rooms.find((r: Room) => { return r.id === command.sourceId });
		const targetRoom = currentGame.rooms.find((r: Room) => { return r.id === command.targetId });

		const fromDirection = findDirection(currentRoom, command);

		const toDirection = findDirection(targetRoom, command);

		const event = new PlayerChangedRoom();
		event.from = { direction: fromDirection, sourceId: currentRoom.id };
		event.to = { direction: toDirection, targetId: targetRoom.id };

		io.sockets.emit('player-changed-room-event', event);
	});

	socket.on('disconnect', function () {

		const currentGame = currentGames.find((g: GameState) => { return g.id === currentGameId });

		if (currentGame === undefined)
			throw 'Non existing game';

		const pl = connectedPlayers.find((p: { socket: any, playerId: string }) => { return p.socket === socket });

		const playerIndex = currentGame.players.findIndex((p: Player) => { return p.id === pl.playerId });

		currentGame.players.splice(playerIndex, 1);

		if (currentGame.players.length === 0) {
			console.log('No more players in game ' + currentGame.id + ' deleting it');
			const index = currentGames.findIndex((g: GameState) => { return g.id === currentGame.id});

			if(index !== -1){
				currentGames.splice(index, 1);
			}
		} else {
			console.log(playerId + ' left game ' + currentGame.id);
			socket.broadcast.emit('player-left', userName);
		}
	});
});