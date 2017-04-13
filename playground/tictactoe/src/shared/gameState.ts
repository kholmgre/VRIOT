import { GameSession, GameStatus } from '../server/gameSession';
import { Player } from '../server/player';
import { Board } from '../server/board';

export class GameState {
    board: Board;
    status: GameStatus = GameStatus.Lobby;
    
    constructor(gameSession: GameSession){
        this.board = gameSession.board;
        this.status = gameSession.status;
    }
}