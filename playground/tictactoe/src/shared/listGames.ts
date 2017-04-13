import { GameSession } from '../server/gameSession';

export class ListGames {
    games: Array<Game> = [];

    constructor(games: Array<GameSession>){
        this.games = games.map((gs: GameSession) => { return new Game(gs.id, gs.id)});
    }
}

export class Game {
    id: string;
    name: string;

    constructor(id: string, name: string){
        this.id = id;
        this.name = name;
    }
}