import { Position } from './position';
import { Utilities } from './utilities';

export class Player {
    name: string;
    position: Position;
    id: string;

    constructor(name: string){
        this.name = name;
        this.id = Utilities.generateGuid();
    }
}