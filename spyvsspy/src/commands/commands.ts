import { IGameRelated } from "../Interfaces/interfaces";
import { Position } from '../position';

export class JoinGameCommand implements IGameRelated {
    gameId: string;
    playerName: string;

    constructor(gameId: string, playerName: string) {
        this.playerName = playerName;
        this.gameId = gameId;
    }
}

export class OpenDoorCommand implements IGameRelated {
    gameId: string;
    sourceId: string;
    targetId: string;
    playerId: string;

    constructor(sourceId: string, targetId: string, player: string, gameId: string) {
        this.sourceId = sourceId;
        this.targetId = targetId;
        this.playerId = player;
        this.gameId = gameId;
    }
}

export class PlayerMoveCommand implements IGameRelated {
    gameId: string;
    playerId: string;
    currentPosition: Position;
    desiredPosition: Position;

    constructor(gameId: string,
        playerId: string,
        currentPosition: Position,
        desiredPosition: Position) {
        this.gameId = gameId;
        this.currentPosition = currentPosition;
        this.playerId = playerId;
        this.desiredPosition = desiredPosition;
    }
}