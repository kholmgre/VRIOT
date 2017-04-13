import { GameSession, GameStatus } from '../server/gameSession';
import { Player } from '../server/player';
import { Board } from '../server/board';

export class GameState {
    board: Board;
    status: GameStatus = GameStatus.Lobby;
    id: string;
    
    constructor(gameSession: GameSession){
        this.board = gameSession.board;
        this.status = gameSession.status;
        this.id = gameSession.id;
    }
}