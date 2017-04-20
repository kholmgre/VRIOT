import { GameSession, GameStatus } from './gameSession';
import { Player } from './player';
import { ListGames } from '../shared/listGames';
import { EventHandlers } from './eventHandlers';
import { MarkerPlaced } from '../shared/markerPlaced';

const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const server = https.createServer({
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
}, app).listen(3000);

const io = require('socket.io').listen(server);
io.set('origins', '*:*');

const gameSessions: Array<GameSession> = [];

io.on('connection', function (socket: any) {

	// Mutable "session" data
	const playerId = socket.id;
	let playername = 'unkown';
	let currentGame: GameSession = null;

	function removeCurrentGame() {
		const gameIndex = gameSessions.findIndex((gs: GameSession) => gs.id === currentGame.id);
		
		if (gameIndex === -1)
			return;

		gameSessions.splice(gameIndex, 1);
	}

	console.log(`player ${socket.id} connected`);

	socket.on('create-game', function () {
		console.log('creating game');

		const newGame = EventHandlers.createGame(playerId, gameSessions, socket);

		currentGame = newGame;
	});

	socket.on('join-game', () => {
		const games = gameSessions.filter((gs: GameSession) => gs.status === GameStatus.Lobby);

		if (games.length > 0) {
			EventHandlers.joinGame(playerId, games[0], socket, io);

			currentGame = games[0];
		}
	});

	socket.on('place-marker', (boxId: string) => {

		const markerWasPlaced = currentGame.placeMarker(playerId, boxId);

		if (markerWasPlaced === true) {
			console.log(`player ${playerId} placed marker on ${boxId}`);
			if (currentGame.status.valueOf() === GameStatus.Finished.valueOf()) {
				io.sockets.in(currentGame.id).emit('game-ended', currentGame.players.find((p: Player) => p.id === currentGame.board.winner).name);
				removeCurrentGame();
			} else if (currentGame.status.valueOf() === GameStatus.Draw.valueOf()) {
				io.sockets.in(currentGame.id).emit('game-draw', 'Game was a draw!');
				removeCurrentGame();
			} else if (currentGame.status.valueOf() === GameStatus.InProgress.valueOf()) {
				const currentGamePlayerName = currentGame.playerCurrentTurn.name;

				console.log(`should be player ${currentGamePlayerName} turn`);

				const playerThatMadeMoveName = currentGame.players.find((p: Player) => p.id === playerId).name;

				io.sockets.in(currentGame.id).emit('marker-placed', new MarkerPlaced(playerThatMadeMoveName, boxId, currentGame.playerCurrentTurn.id));
			} else {
				console.log('Unkown game-state');
				socket.leave(currentGame.id);
				removeCurrentGame();
			}
		} else {
			console.log(`player ${playerId} did not place a marker`);
		}
	});

	socket.on('disconnect', function () {

		console.log('player disconnected');

		if (currentGame === null)
			return;

		if (currentGame.status.valueOf() === GameStatus.InProgress.valueOf()) {
			io.sockets.in(currentGame.id).emit('player-disconnected', 'You won! Other player left the game.');
		}

		removeCurrentGame();

		console.log(`${gameSessions.length} games left`);
	});
});