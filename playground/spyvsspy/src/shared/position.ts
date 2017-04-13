export class Position {
    x: number;
    y: number;
    z: number;

    getPositionString(): string {
        return this.x + ' ' + this.y + ' ' + this.z;
    }
    constructor(x?: number, y?: number, z?: number, position?: Position) {

        let positionArg = position !== undefined && position !== null;

        if(positionArg === false){
            if(x === undefined || x === null || z === undefined || z === null || y === undefined || y === null)
                throw 'Illegal position constructor arguments!';

            this.x = x;
            this.y = y;
            this.z = z;
        } else {
            this.x = position.x;
            this.y = position.y;
            this.z = position.z;
        }
    }
}