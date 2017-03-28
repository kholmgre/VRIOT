import { IGameRelated } from "../Interfaces/interfaces";
import { Position } from '../shared/position';

export class JoinGameCommand {
    playerId: string;
    gameId: string;

    constructor(playerId: string, gameId: string) {
        this.playerId = playerId;
        this.gameId = gameId;
    }
}

export class ChangeName {
    name: string;
}

export class CreateGameCommand {
    playerId: string;
    mapName: string;

    constructor(playerId: string, mapName: string){
        this.playerId = playerId;
        this.mapName = mapName;
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