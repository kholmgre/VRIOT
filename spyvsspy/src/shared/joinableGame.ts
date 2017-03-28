export class JoinableGame {
    id: string;
    map: string;
    players: number;

    constructor(id: string, map: string, players: number){
        this.id = id;
        this.map = map;
        this.players = players;
    }
}