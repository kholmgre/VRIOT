import { Position } from './position';

export class ItemDescription {
    readonly position: Position;
    readonly elementType: string;
    readonly elementValues: any;
    readonly roomId: string;
    readonly type: string;

    constructor(elementType: string, elementValues: any, position: Position = null, roomId: string = null){
        this.position = position;
        this.elementType = elementType;
        this.elementValues = elementValues;
        this.roomId = roomId;

        if(position !== null){
            this.elementValues.position = position.getPositionString();
        }
    }
}