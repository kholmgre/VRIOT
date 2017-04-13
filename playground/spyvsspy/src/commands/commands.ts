import { IGameRelated } from "../Interfaces/interfaces";
import { Position } from '../shared/position';
import { Player } from '../shared/player';
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
    players: Player[];

    constructor(level: LevelTemplate, players: Player[]) {
        this.players = players;
        this.level = level;
    }
}

export class StartCampaignCommand {
    campaignName: string;

    constructor(campaignName: string){
        this.campaignName = campaignName;
    }
}

export class OpenDoorCommand {
    sourceRoom: string;
    targetRoom: string;
    playerId: string;

    constructor(sourceId: string, targetId: string, player: string) {
        this.sourceRoom = sourceId;
        this.targetRoom = targetId;
        this.playerId = player;
    }
}

export class PlayerMoveCommand {
    currentPosition: Position;
    desiredPosition: Position;

    constructor(currentPosition: Position, desiredPosition: Position) {
        this.currentPosition = currentPosition;
        this.desiredPosition = desiredPosition;
    }
}