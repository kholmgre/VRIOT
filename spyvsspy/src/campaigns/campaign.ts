import { LevelTemplate } from '../levels/levelLibrary';
import { Player } from '../shared/player';
import { Utilities } from '../shared/utilities';
import { LevelFinished } from '../events/events';

export enum CampaignState {
    Lobby,
    ShowScore,
    PlayLevel, 
    Finished
}

export class CampaignTemplate {
    levels: LevelTemplate[];
    name: string;
    minPlayers: number;
    maxPlayers: number;
}

export class Campaign {
    id: string;
    campaign: CampaignTemplate;
    players: Player[] = [];
    state: CampaignState = CampaignState.Lobby;
    totalScore: number = 0;
    currentMapIndex: number = 0;

    constructor(campaignTemplate: CampaignTemplate){
        this.id = Utilities.generateGuid();
        this.campaign = Object.assign({}, campaignTemplate);
    }

    start() : LevelTemplate {
        return this.campaign.levels[this.currentMapIndex];
    }

    nextMap() : LevelTemplate {
        this.currentMapIndex++;
        this.state = CampaignState.PlayLevel;
        return this.campaign.levels[this.currentMapIndex];
    }

    addPlayer(player: Player) : void {
        if(this.state !== CampaignState.Lobby)
            return;

        this.players.push(player);

        if(this.players.length === this.campaign.maxPlayers){
            this.state = CampaignState.PlayLevel;
        }
    }

    finishLevel() : LevelFinished {
        this.state = CampaignState.ShowScore;

        const levelFinished = new LevelFinished(this.players, this.totalScore);

        return levelFinished;
    }

    end() : LevelFinished {
        this.state = CampaignState.Finished;
        const levelFinished = new LevelFinished(this.players, this.totalScore);

        return levelFinished;
    }
}