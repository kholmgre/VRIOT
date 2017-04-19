import { GameSession, GameStatus } from './gameSession';
import { Player } from './player';
import { ListGames } from '../shared/listGames';
import { EventHandlers } from './eventHandlers';

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

	socket.on('create-game', function(){
		const newGame = EventHandlers.createGame(playerId, gameSessions, socket);

		currentGame = newGame;
	});

	socket.on('join-game', () => {
		const games = gameSessions.filter((gs: GameSession) => {
			gs.status.valueOf() === GameStatus.Lobby.valueOf();
		});

		console.log('joining game');
		console.log('available games ' + games.length);

		if(games.length > 0){
			EventHandlers.joinGame(playerId, games[0], socket);
		}
	});

	socket.on('place-marker', (boxId: string) => {

		console.log(`player ${playerId} placing marker on ${boxId}`);

		currentGame.placeMarker(playerId, boxId);

		if (currentGame.status === GameStatus.Finished.valueOf()) {
			socket.to(currentGame.id).emit('game-ended', currentGame);
		} else {
			socket.to(currentGame.id).emit('game-state', currentGame);
		}
	});

	socket.on('disconnect', function () {

		console.log('player disconnected');
		console.log(JSON.stringify(currentGame));

		if (currentGame === null)
			return;

		if (currentGame.status === GameStatus.InProgress) {
			socket.to(currentGame.id).emit('player-disconnected', 'Other player left the game :(');
		}

		const gameIndex = gameSessions.findIndex((gs: GameSession) => gs.id === currentGame.id);

		if (gameIndex === -1)
			return;

		gameSessions.splice(gameIndex, 1);

		console.log(`${gameSessions.length} games left`);
	});
});