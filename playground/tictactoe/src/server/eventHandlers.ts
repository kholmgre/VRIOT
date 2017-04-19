import { Player } from './player';
import { GameSession } from './gameSession';

export module EventHandlers {
    export function createGame(playerId: string, gameSessions: Array<GameSession>, socket: any){
		console.log('game created!');
        const player = new Player(playerId, 'Cross');
		const newGame = new GameSession(player);

		gameSessions.push(newGame);

		socket.emit('game-created', newGame);

		return newGame;
    }
	export function joinGame(playerId: string, gameSession: GameSession, socket: any){
		const player = new Player(playerId, 'Circle');

		gameSession.addPlayer(player);

		console.log(`starting game ${gameSession.id}`);

		socket.to(gameSession.id).emit('game-started', gameSession);
	}
}