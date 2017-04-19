export class MarkerPlaced {
    playerName: string;
    boxId: string;

    constructor(playerName: string, boxId: string){
        this.playerName = playerName;
        this.boxId = boxId;
    }
}