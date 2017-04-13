import { Player } from './player';
import { Board } from './board';

export enum GameStatus {
    Lobby = 0,
    InProgress,
    Finished
}

function generateGuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

export class GameSession {
    players: Player[] = [];
    board: Board;
    id: string;
    status: GameStatus = GameStatus.Lobby;

    constructor(startedByPlayer: Player) {
        this.id = generateGuid();
        this.board = new Board();
        this.addPlayer(startedByPlayer);
    }

    public addPlayer(player: Player) {
        if (this.players.length < 2) {
            this.players.push(player);
        }

        if (this.players.length === 2) {
            this.status = GameStatus.InProgress;
        }
    }

    public placeMarker(playerId: string, boxId: string){
        this.board.placeMarker(playerId, boxId);

        if(this.board.finished === true)
            this.status = GameStatus.Finished;
    }
}