import { Player } from './player';
import { Board } from './board';
export declare enum GameStatus {
    Lobby = 0,
    InProgress = 1,
    Finished = 2,
}
export declare class GameSession {
    players: Player[];
    board: Board;
    id: string;
    status: GameStatus;
    playerCurrentTurn: Player;
    constructor(startedByPlayer: Player);
    addPlayer(player: Player): void;
    startGame(): void;
    placeMarker(playerId: string, boxId: string): boolean;
}
