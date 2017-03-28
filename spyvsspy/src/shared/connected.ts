import { JoinableGame } from './joinableGame';

export class Connected {
    mapNames: Array<string> = [];
    playerName: string;
    playerId: string;
    currentGames: Array<JoinableGame> = [];

    constructor(mapNames: Array<string>, currentGames: Array<JoinableGame>, playerName: string, playerId: string){
        this.mapNames = mapNames;
        this.playerName = playerName;
        this.currentGames = currentGames;
        this.playerId = playerId;
    }
}