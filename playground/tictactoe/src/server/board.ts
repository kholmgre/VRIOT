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

        this.winner = null;
    }

    placeMarker(playerId: string, boxId: string): boolean {
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
        if (this.checkBox("1", playerId) === true && this.checkBox("2", playerId) === true && this.checkBox("3", playerId) === true)
            this.playerWon(playerId);
        if (this.checkBox("4", playerId) === true && this.checkBox("5", playerId) === true && this.checkBox("6", playerId) === true)
            this.playerWon(playerId);
        if (this.checkBox("7", playerId) === true && this.checkBox("8", playerId) === true && this.checkBox("9", playerId) === true)
            this.playerWon(playerId);

        // Check columns
        if (this.checkBox("1", playerId) === true && this.checkBox("4", playerId) === true && this.checkBox("7", playerId) === true)
            this.playerWon(playerId);
        if (this.checkBox("2", playerId) === true && this.checkBox("5", playerId) === true && this.checkBox("8", playerId) === true)
            this.playerWon(playerId);
        if (this.checkBox("3", playerId) === true && this.checkBox("6", playerId) === true && this.checkBox("9", playerId) === true)
            this.playerWon(playerId);

        // Check diagonal
        if (this.checkBox("1", playerId) === true && this.checkBox("5", playerId) === true && this.checkBox("9", playerId) === true)
            this.playerWon(playerId);
        if (this.checkBox("3", playerId) === true && this.checkBox("5", playerId) === true && this.checkBox("7", playerId) === true)
            this.playerWon(playerId);

        let allBoxesChecked = true;

        for(let box in this.boxes){
            if(this.boxes[box].checked === false)
                allBoxesChecked = false;
        }

        if(allBoxesChecked === true && this.winner === null){
            this.draw();
        }
    }

    private draw(){
        this.finished = true;
        this.winner = null;
    }

    private playerWon(playerId: string) {
        this.winner = playerId;
        this.finished = true;
    }

    private checkBox(boxId: string, playerId: string): boolean {
        const checkedByPlayer = this.boxes[boxId].byPlayer === playerId && this.boxes[boxId].checked;
        return checkedByPlayer;
    }
}