import { Player } from "../server/player";

export class GameVictory {
    winningPlayerId: string;
    winningPlayerName: string;

    constructor(winningPlayer: Player){
        this.winningPlayerId = winningPlayer.id;
        this.winningPlayerName = winningPlayer.name;
    }
}