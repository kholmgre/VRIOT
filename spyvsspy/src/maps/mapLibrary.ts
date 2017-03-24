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

                room.position = new Position(rowIndex * -15, 0, rowsIndex * -15);
                roomMap[r] = roomOrder;

                const itemsInRoom = metadata.filter((i: ItemDescription) => i.roomId === r);

                if (itemsInRoom.length > 0)
                    room.items = itemsInRoom;

                // check if there was a room before on this row
                if (rowIndex !== 0 && c[rowIndex - 1] !== ' ' && c[rowIndex - 1] !== undefined && c[rowIndex - 1] !== null) {
                    room.doors.W = new WallDescription(c[rowIndex - 1]);
                    room.doors.W.targetPosition = new Position((rowIndex - 1) * -15, 0, rowsIndex * 15);
                }

                // check if there was a room after on this row
                if (rowIndex !== c.length && c[rowIndex + 1] !== ' ' && c[rowIndex + 1] !== undefined && c[rowIndex + 1] !== null) {
                    room.doors.E = new WallDescription(c[rowIndex + 1]);
                    room.doors.E.targetPosition = new Position((rowIndex + 1) * -15, 0, rowsIndex * 15);
                }

                // now check if there was a row before or if there is a row after and if there is a room with the same index
                if (mapArr[rowsIndex - 1] !== null && mapArr[rowsIndex - 1] !== undefined) {
                    if (mapArr[rowsIndex - 1][rowIndex] !== ' ' && mapArr[rowsIndex - 1][rowIndex] !== undefined && mapArr[rowsIndex - 1][rowIndex] !== null) {
                        room.doors.N = new WallDescription(mapArr[rowsIndex - 1][rowIndex]);
                        room.doors.N.targetPosition = new Position(rowIndex * 15, 0, (rowsIndex - 1) * 15);
                    }
                }

                if (mapArr[rowsIndex + 1] !== null && mapArr[rowsIndex + 1] !== undefined) {
                    if (mapArr[rowsIndex + 1][rowIndex] !== ' ' && mapArr[rowsIndex + 1][rowIndex] !== undefined && mapArr[rowsIndex + 1][rowIndex] !== null) {
                        room.doors.S = new WallDescription(mapArr[rowsIndex + 1][rowIndex]);
                        room.doors.S.targetPosition = new Position(rowIndex * 15, 0, (rowsIndex + 1) * -15);
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

    return rooms;
};

const items = [new ItemDescription(new Position(1, 0, 0), "a-text", { "value": "X", "color": "red", "rotation": "-90 0 0", "position": "-4 -1.8 0" }, "1"),
new ItemDescription(new Position(1, 0, 0), "a-text", { "value": "Z", "color": "red", "rotation": "-90 0 0", "position": "0 -1.8 -4" }, "1")];

const rooms = createRoomsFromTemplate(map2Layout, items);

// This is a manual test, should be tested via unit-testing
function assertRoomPosition(room: Room, x: number, y: number, z: number): void {
    if (room.position.x !== x || room.position.y !== y || room.position.z !== z)
        throw 'Room ' + room.id + ' position not correct!';
}

rooms.forEach((r: Room, index: number) => {
    switch (index.toString()) {
        case "0":
            assertRoomPosition(r, 0, 0, 0);
            break;
        case "1":
            assertRoomPosition(r, -15, 0, 0);
            break;
        case "2":
            assertRoomPosition(r, 0, 0, -15);
            break;
        case "3":
            assertRoomPosition(r, -15, 0, -15);
            break;
        default:
            break;
    }
});

// export const oneRoomMap: Array<Room> = createRoomsFromTemplate(map1Layout);
export const fourRoomMap: Array<Room> = rooms;

