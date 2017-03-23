import { IGameRelated } from '../interfaces/interfaces';
import { GameState } from '../server/gameState';
import { Position } from '../shared/position';

export class DoorOpened implements IGameRelated {
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

export class PlayerChangedRoom implements IGameRelated {
    gameId: string;
    from: { direction: string, sourceId: string }
    to: { direction: string, targetId: string }
    playerId: string
}

export class PlayerMoved implements IGameRelated {
    gameId: string;
    playerId: string;
    currentPosition: Position;
    desiredPosition: Position;
}

export class PlayerLeft implements IGameRelated {
    gameId: string;
    playerId: string;
}

export class YouJoined implements IGameRelated {
    gameId: string;
    playerId: string;
    gameState: GameState;
}

export class PlayerJoined implements IGameRelated {
    gameId: string;
    playerId: string;
    gameState: GameState;
}