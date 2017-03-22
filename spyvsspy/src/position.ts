export class Position {
    x: number;
    y: number;
    z: number;

    getPositionString() : string {
        return this.x + ' ' + this.y + ' ' + this.z;
    }

    constructor(x: number, y: number, z: number){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}