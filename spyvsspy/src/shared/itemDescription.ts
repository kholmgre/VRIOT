import { Position } from './position';

export class ItemDescription {
    readonly position: Position;
    readonly elementType: string;
    readonly elementValues: any;
    readonly roomId: string;

    constructor(position: Position, elementType: string, elementValues: any, roomId: string){
        this.position = position;
        this.elementType = elementType;
        this.elementValues = elementValues;
        this.roomId = roomId;
    }
}