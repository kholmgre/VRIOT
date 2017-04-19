class BoxState {
    checked: boolean;
    byPlayer: string;

    constructor() {
        this.checked = false;
    }

    placeMarker(playerId: string) {
        this.checked = true;
        this.byPlayer = playerId;
    }
}

export class Board {
    boxes: any;
    winner: string;
    finished: boolean;

    constructor() {
        this.boxes = {
            1: new BoxState(),
            2: new BoxState(),
            3: new BoxState(),
            4: new BoxState(),
            5: new BoxState(),
            6: new BoxState(),
            7: new BoxState(),
            8: new BoxState(),
            9: new BoxState()
        }
    }

    placeMarker(playerId: string, boxId: string) : boolean {
        if (this.boxes[boxId] === null || this.boxes[boxId] === undefined)
            return false;

        if (this.boxes[boxId].checked === true) {
            return false;
        }

        this.boxes[boxId].placeMarker(playerId);
        this.checkVictoryConditions(playerId);

        return true;
    }

    private checkVictoryConditions(playerId: string) {
        // Check rows
        if (this.checkBox("1", playerId) && this.checkBox("2", playerId) && this.checkBox("3", playerId))
            this.playerWon(playerId);
        if (this.checkBox("4", playerId) && this.checkBox("5", playerId) && this.checkBox("6", playerId))
            this.playerWon(playerId);
        if (this.checkBox("7", playerId) && this.checkBox("8", playerId) && this.checkBox("9", playerId))
            this.playerWon(playerId);
        
        // Check columns
        if (this.checkBox("1", playerId) && this.checkBox("4", playerId) && this.checkBox("7", playerId))
            this.playerWon(playerId);
        if (this.checkBox("2", playerId) && this.checkBox("5", playerId) && this.checkBox("8", playerId))
            this.playerWon(playerId);
        if (this.checkBox("3", playerId) && this.checkBox("6", playerId) && this.checkBox("9", playerId))
            this.playerWon(playerId);
        
        // Check diagonal
        if (this.checkBox("1", playerId) && this.checkBox("5", playerId) && this.checkBox("9", playerId))
            this.playerWon(playerId);
        if (this.checkBox("3", playerId) && this.checkBox("5", playerId) && this.checkBox("7", playerId))
            this.playerWon(playerId);
    }

    private playerWon(playerId: string) {
        this.winner = playerId;
        this.finished = true;
    }

    private checkBox(boxId: string, playerId: string): boolean {
        return this.boxes[boxId].playerId === playerId && this.boxes[boxId].checked;
    }
}