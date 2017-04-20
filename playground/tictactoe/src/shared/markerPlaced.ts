export class MarkerPlaced {
    playerName: string;
    boxId: string;
    currentTurnPlayerId: string;

    constructor(playerName: string, boxId: string, currentTurnPlayerId: string){
        this.playerName = playerName;
        this.boxId = boxId;
        this.currentTurnPlayerId = currentTurnPlayerId;
    }
}