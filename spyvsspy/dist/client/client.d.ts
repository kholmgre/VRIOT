import { GameState } from '../shared/gameState';
import { MarkerPlaced } from '../shared/markerPlaced';
export declare class Client {
    currentGame: GameState;
    socket: any;
    readonly boardElement: HTMLElement;
    constructor(socket: any);
    createBoard(): void;
    private createMenu();
    private createLobby();
    private createUi();
    private cleanBoard();
    private createGameOver(winningPlayer, message?);
    private placeMarker(boxId);
    gameCreated(gameState: GameState): void;
    gameCancelled(reason: string): void;
    startGame(gameState: GameState): void;
    endGame(): void;
    gameUpdate(markerPlaced: MarkerPlaced): void;
}
