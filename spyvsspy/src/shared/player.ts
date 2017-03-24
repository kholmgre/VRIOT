import { Position } from './position';
import { Utilities } from './utilities';

export class Player {
    name: string;
    id: string;
    position: Position;

    constructor(name: string){
        this.name = name;
        this.id = Utilities.generateGuid();
    }
}