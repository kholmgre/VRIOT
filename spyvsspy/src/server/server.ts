import { Player } from '../shared/player';
import { GameState } from './gameState';
import { JoinGameCommand, OpenDoorCommand, PlayerMoveCommand, CreateGameCommand, ChangeName } from '../commands/commands';
import { DoorOpened, PlayerChangedRoom, YouJoined, PlayerJoined, PlayerMoved, PlayerLeft } from '../events/events';
import { Room } from '../shared/rooms';
import { MapLibrary, MapTemplate } from '../maps/mapLibrary';
import { Connected } from '../shared/connected';
import { JoinableGame } from '../shared/joinableGame';

const express = require('express');
const app = express();
const server = app.listen('3000');

const io = require('socket.io').listen(server);
io.set('origins', '*:*');

const currentGames: Array<GameState> = [];

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

function getCurrentGames() : Array<JoinableGame> {
	return currentGames.map((g: GameState) => { return new JoinableGame(g.id, g.map.name, g.players.length)});
}

io.on('connection', function (socket: any) {

	// Mutable "session" data
	const playerId = socket.id;
	let playername = 'player' + io.sockets.clients().length;
	let currentGameId = '';

	console.log('player joined! ' + playerId);

	socket.emit('connected-to-server', new Connected(MapLibrary.map((m: MapTemplate) => m.name), getCurrentGames(), playername, playerId));

	socket.on('get-current-games', function () {
		socket.emit('current-games', { games: currentGames.map((g: GameState) => { return { id: g.id } }) });
	});

	socket.on('change-name', function (command: ChangeName) {
		playername = command.name;
	});

	socket.on('create-game', function (command: CreateGameCommand) {

		const mapTemplate = MapLibrary.find((m: MapTemplate) => m.name === command.mapName);

		if(mapTemplate === undefined)
			return;

		const newGame = new GameState(JSON.parse(JSON.stringify(mapTemplate)));

		currentGames.push(newGame);

		const newPlayer = new Player(playerId);

		newGame.addPlayer(newPlayer);

		const youJoined = new YouJoined();
		youJoined.gameState = newGame;
		youJoined.playerId = newPlayer.id;

		socket.emit('you-joined', youJoined);
	});

	socket.on('join-game', function (command: JoinGameCommand) {

		const gameToJoin = currentGames.find((g: GameState) => g.id === command.gameId);

		if(gameToJoin === undefined)
			return;

		const newPlayer = new Player(command.playerId);

		gameToJoin.addPlayer(newPlayer);

		currentGameId = gameToJoin.id;

		const youJoined = new YouJoined();
		youJoined.gameState = gameToJoin;
		youJoined.playerId = newPlayer.id;

		const playerJoined = new PlayerJoined();
		playerJoined.gameId = currentGameId;
		playerJoined.gameState = gameToJoin;
		playerJoined.playerId = playerId;

		console.log('player ' + playerId + ' joined game ' + gameToJoin.id);

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

		const currentRoom = currentGame.map.rooms.find((r: Room) => { return r.id === command.sourceRoom });
		const targetRoom = currentGame.map.rooms.find((r: Room) => { return r.id === command.targetRoom });

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

		if (event.throughDoor === true) {
			event.targetRoom = command.targetRoom;
			event.room = command.sourceRoom;
			event.direction = fromDirection;
		}

		io.sockets.emit('player-move', event);
	});

	socket.on('disconnect', function () {

		const gamesWithPlayer = currentGames.filter((g: GameState) => { 
			if(g.players.find((p: Player) => p.id === socket.id))
				return true;
			return false;
		});

		gamesWithPlayer.forEach((g: GameState) => {
			const playerIndex = g.players.findIndex((p: Player) => { return p.id === socket.id });
			g.players.splice(playerIndex, 1);

			if (g.players.length === 0) {
				console.log('No more players in game ' + g.id + ' deleting it');
				const index = currentGames.findIndex((g: GameState) => { return g.id === g.id });

				if (index !== -1) {
					currentGames.splice(index, 1);
				}
			} else {
				console.log(playerId + ' left game ' + g.id);
				socket.broadcast.emit('player-left', new PlayerLeft(g.id, playerId));
			}
		});
	});
});