export declare class Board {
    boxes: any;
    winner: string;
    finished: boolean;
    constructor();
    placeMarker(playerId: string, boxId: string): boolean;
    private checkVictoryConditions(playerId);
    private playerWon(playerId);
    private checkBox(boxId, playerId);
}
