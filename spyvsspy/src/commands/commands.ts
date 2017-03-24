import { IGameRelated } from "../Interfaces/interfaces";
import { Position } from '../shared/position';

export class JoinGameCommand {
    playerName: string;

    constructor(playerName: string) {
        this.playerName = playerName;
    }
}

export class OpenDoorCommand implements IGameRelated {
    gameId: string;
    sourceRoom: string;
    targetRoom: string;
    playerId: string;

    constructor(sourceId: string, targetId: string, player: string, gameId: string) {
        this.sourceRoom = sourceId;
        this.targetRoom = targetId;
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