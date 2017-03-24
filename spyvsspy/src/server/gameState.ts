import { Room } from '../shared/rooms';
import { Player } from '../shared/player';
import { Utilities } from '../shared/utilities';
import { Position } from '../shared/position';

export interface IGameState { players: Array<Player>, rooms: Array<Room>, timeRemaining: number };

export interface IMapTemplate { rooms: Array<Room>, name: string };

export class MapTemplate implements IMapTemplate {
    rooms: Room[];
    name: string;

    constructor(rooms: Array<Room>, name: string) {
        this.rooms = rooms;
        this.name = name;
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
        const room = Utilities.getRandomInt(0, this.rooms.length - 1);

        return new Position(Utilities.getRandomInt(0, 1), -3, Utilities.getRandomInt(0, 1));
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