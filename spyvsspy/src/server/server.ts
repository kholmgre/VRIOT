import { Player } from '../player';
import { GameState, MapTemplate } from '../gameState';
import { JoinGameCommand, OpenDoorCommand, PlayerMoveCommand } from '../commands/commands';
import { DoorOpened, PlayerChangedRoom, YouJoined } from '../events/events';
import { Room } from '../rooms';
import { oneRoomMap } from '../maps/mapLibrary';

const express = require('express');
const app = express();
const server = app.listen('3000');

const io = require('socket.io').listen(server);
io.set('origins', '*:*');

console.log(JSON.stringify(oneRoomMap));

const template = new MapTemplate(oneRoomMap, "Testing generated");

const currentGames: Array<GameState> = [];

const connectedPlayers: Array<{ socket: any, playerId: string }> = [];

io.on('connection', function (socket: any) {

	// Mutable "session" data
	const userName = '';
	let playerId = '';
	let currentGameId = '';

	console.log('player joined!');

	socket.on('join', function (data: JoinGameCommand) {

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

		console.log('player ' + data.playerName + ' joined game ' + gameToJoin.id);

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

	// Warning, code smell..
	function findDirection(room: Room, command: DoorOpened): string {
		let direction = '';
		if (room.doors.E !== null && room.doors.E !== undefined) {
			if (room.doors["E"].targetRoom === command.targetId) {
				room.doors["E"].open = true;
				direction = "E";
			}
		} 
		
		if (room.doors["N"] !== null && room.doors["N"] !== undefined) {
			if (room.doors["N"].targetRoom === command.targetId) {
				room.doors["N"].open = true;
				direction = "N";
			}
		} 
		if (room.doors["S"] !== null && room.doors["S"] !== undefined) {
			if (room.doors["S"].targetRoom === command.targetId) {
				room.doors["S"].open = true;
				direction = "S";
			}
		} 
		
		if (room.doors["W"] !== null && room.doors["W"] !== undefined) {
			if (room.doors["W"].targetRoom === command.targetId) {
				room.doors["W"].open = true;
				direction = "W";
			}
		}

		return direction;
	}

	socket.on('player-change-room-command', function (command: OpenDoorCommand) {

		console.log('player-change-room' + JSON.stringify(command));

		const currentGame = currentGames.find((g: GameState) => { return g.id === currentGameId });

		if (currentGame === undefined)
			console.warn('Player disconnected from non-existing game..');

		const currentRoom = currentGame.rooms.find((r: Room) => { return r.id === command.sourceId });
		const targetRoom = currentGame.rooms.find((r: Room) => { return r.id === command.targetId });

		const fromDirection = findDirection(currentRoom, command);

		const toDirection = findDirection(targetRoom, command);

		const event = new PlayerChangedRoom();
		event.from = { direction: fromDirection, sourceId: currentRoom.id };
		event.to = { direction: toDirection, targetId: targetRoom.id };
		event.playerId = playerId;
		event.gameId = currentGameId;

		console.log('event ' + JSON.stringify(event));

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