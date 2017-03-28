import { Player } from '../shared/player';
import { GameState, MapTemplate } from './gameState';
import { JoinGameCommand, OpenDoorCommand, PlayerMoveCommand } from '../commands/commands';
import { DoorOpened, PlayerChangedRoom, YouJoined, PlayerJoined, PlayerMoved, PlayerLeft } from '../events/events';
import { Room } from '../shared/rooms';
import { fourRoomMap } from '../maps/mapLibrary';

const express = require('express');
const app = express();
const server = app.listen('3000');

const io = require('socket.io').listen(server);
io.set('origins', '*:*');

const currentGames: Array<GameState> = [];

const connectedPlayers: Array<{ socket: any, playerId: string }> = [];

function findDirection(room: Room, target: string): string {
	let direction = '';

	const directions = ['E', 'S', 'W', 'N'];

	directions.forEach((d: string) => {
		if (room.doors[d] !== null && room.doors[d] !== undefined) {
			if (room.doors[d].targetRoom === target) {
				direction = d;
			}
		}
	});

	return direction;
}

io.on('connection', function (socket: any) {

	// Mutable "session" data
	const userName = '';
	let playerId = '';
	let currentGameId = '';

	console.log('player joined!');

	socket.on('join', function (data: JoinGameCommand) {

		let gameToJoin: GameState = null;

		if (currentGames.length === 0) {
			const copyOfRooms = JSON.parse(JSON.stringify(fourRoomMap));
			gameToJoin = new GameState(new MapTemplate(copyOfRooms, "Testing generated"));
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

		const playerJoined = new PlayerJoined();
		playerJoined.gameId = currentGameId;
		playerJoined.gameState = gameToJoin;
		playerJoined.playerId = playerId;

		console.log('player ' + data.playerName + ' joined game ' + gameToJoin.id);

		console.log('\n' + JSON.stringify(playerJoined.gameState));

		socket.emit('you-joined', youJoined);
		socket.broadcast.emit('player-joined', playerJoined);
	});

	socket.on('player-move-command', function (input: PlayerMoveCommand) {

		// Todo verify legal
		// Player moved between rooms

		const currentGame = currentGames.find((g: GameState) => g.id === currentGameId);

		const player = currentGame.players.find((p: Player) => p.id === input.playerId);

		player.position = input.desiredPosition;

		console.log(JSON.stringify(currentGame));

		io.sockets.emit('player-move', input);
	});

	socket.on('open-door-command', function (command: OpenDoorCommand) {

		console.log('received open-door-command ' + JSON.stringify(command));

		const currentGame = currentGames.find((g: GameState) => { return g.id === currentGameId });

		const currentRoom = currentGame.rooms.find((r: Room) => { return r.id === command.sourceRoom });
		const targetRoom = currentGame.rooms.find((r: Room) => { return r.id === command.targetRoom });

		const fromDirection = findDirection(currentRoom, command.targetRoom);

		const toDirection = findDirection(targetRoom, command.sourceRoom);

		if (toDirection === '') {
			console.log('toDirection was null\n' + JSON.stringify(command));
		}

		// Refactor

		let emitDoorOpenEvent: boolean;

		switch (fromDirection) {
			case 'E':
				if (currentRoom.doors.E.open !== true) {
					currentRoom.doors.E.open = true;
					targetRoom.doors.W.open = true;
					emitDoorOpenEvent = true;
				}
				break;
			case 'W':
				if (currentRoom.doors.W.open !== true) {
					currentRoom.doors.W.open = true;
					targetRoom.doors.E.open = true;
					emitDoorOpenEvent = true;
				} 
				break;
			case 'N':
				if (currentRoom.doors.N.open !== true) {
					currentRoom.doors.N.open = true;
					targetRoom.doors.S.open = true;
					emitDoorOpenEvent = true;
				}
				break;
			case 'S':
				if (currentRoom.doors.S.open !== true) {
					currentRoom.doors.S.open = true;
					targetRoom.doors.N.open = true;
					emitDoorOpenEvent = true;
				} 
				break;
			default:
				break;
		}

		if (emitDoorOpenEvent === true) {
			console.log('emitting door opened event');
			// TODO: update game state with door state, so joining players will see opened doors
			const doorOpenedEvent = new DoorOpened(currentRoom.id, targetRoom.id, playerId, currentGameId);
			io.sockets.emit('door-opened', doorOpenedEvent)
		}

		const event = new PlayerMoved();
		event.desiredPosition = currentRoom.doors[fromDirection].targetPosition;
		event.playerId = playerId;
		event.throughDoor = true;

		if(event.throughDoor === true){
			event.targetRoom = command.targetRoom;
			event.room = command.sourceRoom;
			event.direction = fromDirection;
		}

		io.sockets.emit('player-move', event);
	});

	socket.on('disconnect', function () {

		const currentGame = currentGames.find((g: GameState) => { return g.id === currentGameId });

		if (currentGame === undefined)
			console.log('Player exited non-existing game.');

		const pl = connectedPlayers.find((p: { socket: any, playerId: string }) => { return p.socket === socket });

		const playerIndex = currentGame.players.findIndex((p: Player) => { return p.id === pl.playerId });

		currentGame.players.splice(playerIndex, 1);

		if (currentGame.players.length === 0) {
			console.log('No more players in game ' + currentGame.id + ' deleting it');
			const index = currentGames.findIndex((g: GameState) => { return g.id === currentGame.id });

			if (index !== -1) {
				currentGames.splice(index, 1);
			}
		} else {
			console.log(playerId + ' left game ' + currentGame.id);
			socket.broadcast.emit('player-left', new PlayerLeft(currentGame.id, playerId));
		}
	});
});