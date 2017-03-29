import { Position } from './position';
import { Utilities } from './utilities';

export class Player {
    name: string;
    id: string;
    position: Position;

    constructor(id: string, name?: string){
        this.name = name;
        this.id = id;
    }
}