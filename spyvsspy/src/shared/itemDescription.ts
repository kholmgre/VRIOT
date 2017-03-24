import { Position } from './position';

export class ItemDescription {
    readonly position: Position;
    readonly elementType: string;
    readonly elementValues: Object;
    readonly roomId: string;

    constructor(position: Position, elementType: string, elementValues: Object, roomId: string){
        this.position = position;
        this.elementType = elementType;
        this.elementValues = elementValues;
        this.roomId = roomId;
    }
}