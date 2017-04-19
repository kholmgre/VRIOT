import { Player } from './player';
import { GameSession } from './gameSession';

export module EventHandlers {
    export function createGame(playerId: string, gameSessions: Array<GameSession>, socket: any){
        const player = new Player(playerId, 'Cross');
		const newGame = new GameSession(player);

		gameSessions.push(newGame);

		console.log(`created game with id: ${newGame.id}`);

		socket.join(newGame.id);

		socket.emit('game-created', newGame);

		return newGame;
    }
	export function joinGame(playerId: string, gameSession: GameSession, socket: any, io: any){
		const player = new Player(playerId, 'Circle');

		console.log(`joining game ${gameSession.id}`)
		console.log(`joining game ${gameSession.board}`)

		gameSession.addPlayer(player);

		socket.join(gameSession.id);

		io.sockets.in(gameSession.id).emit('game-started', gameSession);
	}
}