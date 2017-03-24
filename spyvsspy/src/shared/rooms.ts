export class WallDescription {
    targetRoom?: string;
    open?: boolean;
    color: string;

    constructor(targetRoom?: string, color?: string){
        this.targetRoom = targetRoom;
        this.open = false;
        if(color === null || color === undefined)
            color = '#FFF000';
    }
}

export class Room {
    id: string;
    doors: {
        E: WallDescription,
        S: WallDescription,
        W: WallDescription,
        N: WallDescription
    }
    floor: {
        color: string
    }
    roof: {
        color: string
    }
    items: any[] = []
    setWallColors(color: string) : void {

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
    }

    constructor(id?: string) {
        if (id !== null && id !== undefined) {
            this.id = id;
        } else {
            throw 'No id for room!';
        }
        this.doors = { E: { color: ''}, W: { color: '' }, S: { color: '' }, N: { color: '' }};
        this.floor = { color: '' };
        this.roof = { color: '' };
    }
}