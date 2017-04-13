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
    currentTurnPlayer: Player;

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
            this.startGame();
        }
    }

    public startGame() {
        this.status = GameStatus.InProgress;
        this.currentTurnPlayer = this.players[0];
    }

    public placeMarker(playerId: string, boxId: string) {
        if (playerId !== this.currentTurnPlayer.id) {
            console.log('Player tried to place marker when it was not that players turn..');
            return;
        }

        this.board.placeMarker(playerId, boxId);

        if (this.board.finished === true) {
            this.status = GameStatus.Finished;
        } else {
            this.currentTurnPlayer = this.players.find((p: Player) => p.id !== playerId);
        }

    }
}