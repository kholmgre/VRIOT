import { Room, WallDescription } from '../shared/rooms';
import { colors } from './colors';
import { Utilities } from '../shared/utilities';
import { ItemDescription } from '../shared/itemDescription';
import { Position } from '../shared/position';
import { AdditionalInfo } from './additionalInfo';
import { allDirections } from './directionDebug';

export class MapTemplate {
    rooms: Room[];
    name: string;

    constructor(rooms: Array<Room>, name: string) {
        this.rooms = rooms;
        this.name = name;
    }
}

const map1Layout = { name: "test", template: '1AB\n2 6\n3457\n9  8\n' };
const map2Layout = { name: "test2", template: '12\n34\n' };
// Above should be fetched from a db

const maps = [map1Layout, map2Layout];

const debugDirections = true;

function checkIfConnectedOnSameXAxis(mapRow: Array<any>, xPos: number): [boolean, string[]] {

    const returnValue: [boolean, string[]] = [false, []];

    if (mapRow[xPos - 1] !== null && mapRow[xPos - 1] !== undefined && mapRow[xPos - 1] !== ' ') {
        returnValue[0] = true;
        returnValue[1].push('W');
    }

    if (mapRow[xPos + 1] !== null && mapRow[xPos + 1] !== undefined && mapRow[xPos + 1] !== ' ') {
        returnValue[0] = true;
        returnValue[1].push('E');
    }

    return returnValue;
}

function checkIfConnectedOnZAxis(mapContainer: Array<any>, mapRow: Array<any>, xPos: number, zPos: number): [boolean, string[]] {

    const returnValue: [boolean, string[]] = [false, []];

    if (mapContainer[zPos - 1] !== null && mapContainer[zPos - 1] !== undefined) {
        if (mapContainer[zPos - 1][xPos] !== null && mapContainer[zPos - 1][xPos] !== undefined && mapContainer[zPos - 1][xPos] !== ' ') {
            returnValue[0] = true;
            returnValue[1].push('N');
        }
    }

    if (mapContainer[zPos + 1] !== null && mapContainer[zPos + 1] !== undefined) {
        if (mapContainer[zPos + 1][xPos] !== null && mapContainer[zPos + 1][xPos] !== undefined && mapContainer[zPos + 1][xPos] !== ' ') {
            returnValue[0] = true;
            returnValue[1].push('S');
        }
    }

    return returnValue;
}

function getPosByDirection(direction: string): number {
    switch (direction) {
        case 'W':
            return -1;
        case 'E':
            return 1;
        case 'N':
            return -1;
        case 'S':
            return 1;
        default:
            return 0;
    }
}

const createRoomsFromTemplate = (layout: string, additionalInfo: AdditionalInfo = null) => {
    let mapRows: any = [];
    let currentRow = [];
    let rooms: Array<Room> = [];

    for (var index = 0; index < layout.length; index++) {
        var element = layout[index];

        if (element !== '\n') {
            currentRow.push(element);
        } else {
            mapRows.push(currentRow);
            currentRow = [];
        }
    }

    const defaultItems = additionalInfo.items.filter((i: ItemDescription) => i.roomId === 'all');

    // const elevator = new ItemDescription('a-plane', [{"color" : "grey"}]);

    mapRows.forEach((mapRow: any[], zPos: number) => {
        mapRow.forEach((roomId: string, xPos: number) => {
            // ' '-means an empy space between rooms
            if (roomId !== ' ') {
                const room = new Room(roomId);

                const roomPositionOnXAxis = xPos * -15; // this is to make each room in the array be placed 15 meters east/negative x-axis from eachother
                const roomPositionOnZAxis = zPos * -15; // this is to make each room in the array be placed 15 meters south/negative z-axis from eachother
                const roomPositionOnYAxis = 0; // all rooms are on the same y-axis

                room.position = new Position(roomPositionOnXAxis, roomPositionOnYAxis, roomPositionOnZAxis);

                // Check if any items should be added to the room
                const itemsInRoom = additionalInfo.items.filter((i: ItemDescription) => i.roomId === roomId).concat(defaultItems);

                if (itemsInRoom.length > 0)
                    room.items = itemsInRoom;

                const doorOnXAxisResult = checkIfConnectedOnSameXAxis(mapRow, xPos);

                if (doorOnXAxisResult[0] === true) {
                    doorOnXAxisResult[1].forEach((direction: string) => {
                        const door = room.doors[direction] = new WallDescription(mapRow[xPos + getPosByDirection(direction)]);
                        // door.targetPosition = new Position((getPosByDirection(direction)) * -15, 0, zPos * -15);
                    });
                }

                const doorOnZAxisResult = checkIfConnectedOnZAxis(mapRows, mapRow, xPos, zPos);

                if (doorOnZAxisResult[0] === true) {
                    doorOnZAxisResult[1].forEach((direction: string) => {
                        const door = room.doors[direction] = new WallDescription(mapRows[zPos + getPosByDirection(direction)][xPos]);
                        // door.targetPosition = new Position(xPos * -15, 0, getPosByDirection(direction) * -15);
                    });
                }

                room.setWallColors(colors[Utilities.getRandomInt(0, colors.length - 1)]);
                const roofAndFloorColor = colors[Utilities.getRandomInt(0, colors.length - 1)];
                room.floor.color = roofAndFloorColor;
                room.roof.color = roofAndFloorColor;
                room.setDoorTargetPositions();

                rooms.push(room);
            }
        });
    });

    return rooms;
};

const mapTemplates: MapTemplate[] = [];

if (debugDirections === true) {

    const additionalInfo = new AdditionalInfo();
    additionalInfo.items = allDirections;

    maps.forEach((mt: { name: string, template: string}) => {
        mapTemplates.push(new MapTemplate(createRoomsFromTemplate(mt.template, additionalInfo), mt.name));
    });
} else {
    maps.forEach((mt: { name: string, template: string}) => {
        mapTemplates.push(new MapTemplate(createRoomsFromTemplate(mt.template), mt.name));
    });
}

export const MapLibrary: Array<MapTemplate> = mapTemplates;

