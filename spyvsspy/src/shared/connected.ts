import { JoinableGame } from './joinableGame';
import { CampaignTemplate, Campaign } from '../campaigns/campaign';

export class Connected {
    campaigns: CampaignTemplate[] = [];
    playerName: string;
    playerId: string;
    joinableCampaigns: Array<Campaign> = [];

    constructor(campaigns: CampaignTemplate[], joinableCampaign: Campaign[], playerName: string, playerId: string){
        this.campaigns = campaigns;
        this.playerName = playerName;
        this.joinableCampaigns = joinableCampaign;
        this.playerId = playerId;
    }
}