import { IGameRelated } from '../interfaces/interfaces';
import { GameState } from '../server/gameState';
import { Position } from '../shared/position';
import { Player } from '../shared/player';

export class DoorOpened  {
    sourceId: string;
    targetId: string;
    playerId: string;

    constructor(sourceId: string, targetId: string, player: string) {
        this.sourceId = sourceId;
        this.targetId = targetId;
        this.playerId = player;
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
    throughDoor: boolean;
    room: string;
    targetRoom: string;
    direction: string;
}

export class PlayerLeft implements IGameRelated {
    gameId: string;
    playerId: string;

    constructor(gameId: string, playerId: string){
        this.gameId = gameId; 
        this.playerId = playerId;
    }
}

export class JoinedCampaign {
    
}

export class PlayerJoined implements IGameRelated {
    gameId: string;
    playerId: string;
    gameState: GameState;
}

export class LevelFinished {
    players: Player[];
    totalScore: number;

    constructor(players: Player[], totalScore: number){
        this.players = players;
        this.totalScore = totalScore;
    }
}