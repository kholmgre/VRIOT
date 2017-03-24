import { Room, WallDescription } from '../shared/rooms';
import { colors } from './colors';
import { Utilities } from '../shared/utilities';
import { ItemDescription } from '../shared/itemDescription';
import { Position } from '../shared/position';

const map1Layout = '1AB\n2 6\n3457\n9  8\n';
const map2Layout = '12\n34\n';

const createRoomsFromTemplate = (layout: string, metadata: any[] = []) => {
    let mapArr: any = [];
    let currentRow = [];
    let rooms: Array<Room> = [];

    for (var index = 0; index < layout.length; index++) {
        var element = layout[index];

        if (element !== '\n') {
            currentRow.push(element);
        } else {
            mapArr.push(currentRow);
            currentRow = [];
        }
    }

    // Keeping track of room index. It is used when generating y position for room
    let roomOrder = 0;

    // key === roomId, value === order of room
    const roomMap: any = {};

    mapArr.forEach((c: any[], rowsIndex: number) => {
        c.forEach((r: string, rowIndex: number) => {
            if (r !== ' ') {
                // check metadata for room details
                const room = new Room(r);
                room.position = new Position(0, roomOrder * 5, 0);
                roomMap[r] = roomOrder;

                const itemsInRoom = metadata.filter((i: ItemDescription) => i.roomId === r);

                if (itemsInRoom.length > 0)
                    room.items = itemsInRoom;

                // check if there was a room before on this row
                if (rowIndex !== 0 && c[rowIndex - 1] !== ' ' && c[rowIndex - 1] !== undefined && c[rowIndex - 1] !== null) {
                    room.doors.W = new WallDescription(c[rowIndex - 1]);
                }

                if (rowIndex !== c.length && c[rowIndex + 1] !== ' ' && c[rowIndex + 1] !== undefined && c[rowIndex + 1] !== null) {
                    room.doors.E = new WallDescription(c[rowIndex + 1]);
                }

                // now check if there was a row before or if there is a row after and if there is a room with the same index
                if (mapArr[rowsIndex - 1] !== null && mapArr[rowsIndex - 1] !== undefined) {
                    if (mapArr[rowsIndex - 1][rowIndex] !== ' ' && mapArr[rowsIndex - 1][rowIndex] !== undefined && mapArr[rowsIndex - 1][rowIndex] !== null) {
                        room.doors.N = new WallDescription(mapArr[rowsIndex - 1][rowIndex]);
                    }
                }

                if (mapArr[rowsIndex + 1] !== null && mapArr[rowsIndex + 1] !== undefined) {
                    if (mapArr[rowsIndex + 1][rowIndex] !== ' ' && mapArr[rowsIndex + 1][rowIndex] !== undefined && mapArr[rowsIndex + 1][rowIndex] !== null) {
                        room.doors.S = new WallDescription(mapArr[rowsIndex + 1][rowIndex]);
                    }
                }

                room.setWallColors(colors[Utilities.getRandomInt(0, colors.length - 1)]);
                const roofAndFloorColor = colors[Utilities.getRandomInt(0, colors.length - 1)];
                room.floor.color = roofAndFloorColor;
                room.roof.color = roofAndFloorColor;

                rooms.push(room);
                roomOrder++;
            }
        });
    });

    rooms.forEach((r: Room) => {
        if(r.doors.E.targetRoom !== null && r.doors.E.targetRoom !== undefined){
            // we are going east so we are entering from west according to the target room origin axis
            r.doors.E.targetPosition = new Position(0, roomMap[r.doors.E.targetRoom], 2.5);
        }
        if(r.doors.W.targetRoom !== null && r.doors.W.targetRoom !== undefined){
            r.doors.W.targetPosition = new Position(0, roomMap[r.doors.W.targetRoom], -2.5);
        }
        if(r.doors.S.targetRoom !== null && r.doors.S.targetRoom !== undefined){
            r.doors.S.targetPosition = new Position(2.5, roomMap[r.doors.S.targetRoom], 0);
        }
        if(r.doors.N.targetRoom !== null && r.doors.N.targetRoom !== undefined){
            r.doors.N.targetPosition = new Position(-2.5, roomMap[r.doors.N.targetRoom], 0);
        }
    });

    return rooms;
};

const items = [new ItemDescription(new Position(1, 0, 0), "a-text", { "value": "X", "color": "red", "rotation": "-90 0 0", "position": "-4 1.5 0" }, "1"),
new ItemDescription(new Position(1, 0, 0), "a-text", { "value": "Z", "color": "red", "rotation": "-90 0 0", "position": "0 1.5 -4" }, "1")];

const itemExample = items;

// export const oneRoomMap: Array<Room> = createRoomsFromTemplate(map1Layout);
export const fourRoomMap: Array<Room> = createRoomsFromTemplate(map2Layout, itemExample);

