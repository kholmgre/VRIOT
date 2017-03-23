import { Player } from '../shared/player';
import { GameState, MapTemplate } from './gameState';
import { JoinGameCommand, ChangeRoomCommand, PlayerMoveCommand } from '../commands/commands';
import { DoorOpened, PlayerChangedRoom, YouJoined } from '../events/events';
import { Room } from '../shared/rooms';
import { oneRoomMap, fourRoomMap } from '../maps/mapLibrary';

const express = require('express');
const app = express();
const server = app.listen('3000');

const io = require('socket.io').listen(server);
io.set('origins', '*:*');

console.log(JSON.stringify(fourRoomMap));

const currentGames: Array<GameState> = [];

const connectedPlayers: Array<{ socket: any, playerId: string }> = [];

// Warning, code smell..
function findDirection(room: Room, target: string): string {
	let direction = '';
	if (room.doors.E !== null && room.doors.E !== undefined) {
		if (room.doors["E"].targetRoom === target) {
			room.doors["E"].open = true;
			direction = "E";
		}
	}

	if (room.doors["N"] !== null && room.doors["N"] !== undefined) {
		if (room.doors["N"].targetRoom === target) {
			room.doors["N"].open = true;
			direction = "N";
		}
	}
	if (room.doors["S"] !== null && room.doors["S"] !== undefined) {
		if (room.doors["S"].targetRoom === target) {
			room.doors["S"].open = true;
			direction = "S";
		}
	}

	if (room.doors["W"] !== null && room.doors["W"] !== undefined) {
		if (room.doors["W"].targetRoom === target) {
			room.doors["W"].open = true;
			direction = "W";
		}
	}

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

		console.log('player ' + data.playerName + ' joined game ' + gameToJoin.id);

		socket.emit('you-joined', youJoined);
		socket.broadcast.emit('player-joined', newPlayer);
	});

	socket.on('player-move', function (input: PlayerMoveCommand) {

		// Todo verify legal

		console.log(JSON.stringify(input));
		io.sockets.emit('player-move', input);
	});

	socket.on('player-change-room-command', function (command: ChangeRoomCommand) {

		console.log('change room');
		console.log('template: \n' + JSON.stringify(fourRoomMap));

		const currentGame = currentGames.find((g: GameState) => { return g.id === currentGameId });

		const currentRoom = currentGame.rooms.find((r: Room) => { return r.id === command.sourceId });
		const targetRoom = currentGame.rooms.find((r: Room) => { return r.id === command.targetId });

		const fromDirection = findDirection(currentRoom, command.targetId);

		const toDirection = findDirection(targetRoom, command.sourceId);

		// Refactor

		let emitDoorOpenEvent: [boolean, string];

		switch (toDirection) {
			case 'E':
				if (currentRoom.doors.E.open !== true) {
					currentRoom.doors.E.open = true;
					emitDoorOpenEvent = [true, 'E'];
				} else emitDoorOpenEvent = [false, ''];
				break;
			case 'W':
				if (currentRoom.doors.W.open !== true) {
					currentRoom.doors.W.open = true;
					emitDoorOpenEvent = [true, 'W'];
				} else emitDoorOpenEvent = [false, ''];
				break;
			case 'N':
				if (currentRoom.doors.N.open !== true) {
					currentRoom.doors.N.open = true;
					emitDoorOpenEvent = [true, 'N'];
				} else emitDoorOpenEvent = [false, ''];
				break;
			case 'S':
				if (currentRoom.doors.S.open !== true) {
					currentRoom.doors.S.open = true;
					emitDoorOpenEvent = [true, 'S'];
				} else emitDoorOpenEvent = [false, ''];
				break;
			default:
				emitDoorOpenEvent = [false, ''];
				break;
		}

		if (emitDoorOpenEvent[0] === true) {
			switch (emitDoorOpenEvent[1]) {
				case 'N':
					targetRoom.doors['S'].open = true;
					break;
				case 'S':
					targetRoom.doors['N'].open = true;
					break;
				case 'W':
					targetRoom.doors['E'].open = true;
					break;
				case 'E':
					targetRoom.doors['W'].open = true;
					break;
				default:
					break;
			}

			console.log('emitting door opened event');
			// TODO: update game state with door state, so joining players will see opened doors
			const doorOpenedEvent = new DoorOpened(currentRoom.id, targetRoom.id, playerId, currentGameId);
			io.sockets.emit('door-opened', doorOpenedEvent)
		}

		const event = new PlayerChangedRoom();
		event.from = { direction: fromDirection, sourceId: currentRoom.id };
		event.to = { direction: toDirection, targetId: targetRoom.id };
		event.playerId = playerId;
		event.gameId = currentGameId;

		io.sockets.emit('player-changed-room-event', event);
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
			socket.broadcast.emit('player-left', userName);
		}
	});
});