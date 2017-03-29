import { IGameRelated } from "../Interfaces/interfaces";
import { Position } from '../shared/position';
import { LevelTemplate } from '../levels/levelLibrary';

export class JoinCampaignCommand {
    campaignId: string;

    constructor(campaignId: string) {
        this.campaignId = campaignId;
    }
}

export class ChangeNameCommand {
    name: string;

    constructor(name: string){
        this.name = name;
    }
}

export class PlayLevelCommand {
    level: LevelTemplate;

    constructor(level: LevelTemplate) {
        this.level = level;
    }
}

export class CreateCampaignCommand {
    playerId: string;
    campaignName: string;

    constructor(playerId: string, campaignName: string){
        this.playerId = playerId;
        this.campaignName = campaignName;
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