import { Position } from '../shared/position';

export class WallDescription {
    targetRoom?: string;
    open?: boolean;
    color: string;
    targetPosition?: Position;

    constructor(targetRoom?: string, color?: string) {
        this.targetRoom = targetRoom;
        this.open = false;
        if (color === null || color === undefined)
            color = '#FFF000';
    }
}

export class Room {
    id: string;
    doors: any;
    floor: { color: string };
    roof: { color: string };
    position: Position;
    items: any[] = [];
    setWallColors(color: string): void {

        if (this.doors === null || this.doors === undefined)
            return;

        if (this.doors.E !== null && this.doors.E !== undefined) {
            this.doors.E.color = color;
        } else if (this.doors.W !== null && this.doors.W !== undefined) {
            this.doors.W.color = color;
        } else if (this.doors.N !== null && this.doors.N !== undefined) {
            this.doors.N.color = color;
        } else if (this.doors.S !== null && this.doors.S !== undefined) {
            this.doors.S.color = color;
        }
    };
    // This will work as long as we always want to place rooms with the same distance
    setDoorTargetPositions(): void {
        for (var door in this.doors) {

            if(this.doors[door].targetRoom === null || this.doors[door].targetRoom === undefined)
                continue;

            let x = this.position.x;
            let y = this.position.y;
            let z = this.position.z;

            let distance = 12;

            if (door === 'W') {
                x = this.position.x + distance;
            }

            if (door === 'E') {
                x = this.position.x - distance;
            }

            if (door === 'S') {
                z = this.position.z - distance;
            }

            if (door === 'N') {
                z = this.position.z + distance;
            }

            this.doors[door].targetPosition = new Position(x, y, z);
        }
    }

    constructor(id?: string) {
        if (id !== null && id !== undefined) {
            this.id = id;
        } else {
            throw 'No id for room!';
        }
        this.doors = { E: { color: '' }, W: { color: '' }, S: { color: '' }, N: { color: '' } };
        this.floor = { color: '' };
        this.roof = { color: '' };
    }
}