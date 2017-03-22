import { Room } from './rooms';
import { Player } from './player';
import { Utilities } from './utilities';
import { Position } from './position';

export interface IGameState { players: Array<Player>, rooms: Array<Room>, timeRemaining: number };

export interface IMapTemplate { rooms: Array<Room> };

export class MapTemplate implements IMapTemplate {
    rooms: Room[];

    constructor(rooms: Array<Room>) {
        this.rooms = rooms;
    }
}

export class GameState implements IGameState {
    players: Player[];
    rooms: Room[];
    timeRemaining: number;
    id: string;

    constructor(template: MapTemplate) {
        this.rooms = template.rooms;
        this.timeRemaining = 360;
        this.id = Utilities.generateGuid();
        this.players = [];
    }

    private getPositionForNewPlayer(player: Player): Position {
        return new Position(0, 0, 0);
    }

    addPlayer(player: Player): void {
        if (this.players.find((p: Player) => { return p.id === player.id }) !== undefined)
            return;
        
        let pos = this.getPositionForNewPlayer(player);
        player.position = pos;
        this.players.push(player);
    }

    removePlayer(playerId: string) {
        throw 'Not implemented';
    }
}