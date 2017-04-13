import { GameSession, GameStatus } from './gameSession';
import { Player } from './player';
import { ListGames } from '../shared/listGames';

const express = require('express');
const app = express();
const server = app.listen('3000');

const io = require('socket.io').listen(server);
io.set('origins', '*:*');

const gameSessions: Array<GameSession> = [];

io.on('connection', function (socket: any) {

	console.log('connect!');

	// Mutable "session" data
	const playerId = socket.id;
	let playername = 'unkown';
	let currentGame: GameSession = null;

	io.emit('list-games', new ListGames(gameSessions));

	io.on('create-game', () => {
		const player = new Player(playerId, 'Cross');
		const newGame = new GameSession(player);
		currentGame = newGame;

		gameSessions.push(newGame);

		socket.broadcast.emit('game-state', currentGame);
	});

	io.on('join-game', (gameId: string) => {
		const gameToJoin = gameSessions.find((gs: GameSession) => gs.id === gameId);

		const player = new Player(playerId, 'Circle');

		gameToJoin.addPlayer(player);

		socket.broadcast.emit('game-state', currentGame);
	});

	io.on('place-marker', (boxId: string) => {
		currentGame.placeMarker(playerId, boxId);

		socket.broadcast.emit('game-state', currentGame);
	});
});