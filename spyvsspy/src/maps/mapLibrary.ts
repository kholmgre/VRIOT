import { Room, WallDescription } from '../shared/rooms';
import { colors } from './colors';
import { Utilities } from '../shared/utilities';
import { ItemDescription } from '../shared/itemDescription';
import { Position } from '../shared/position';

const map1Layout = '1AB\n2 6\n3457\n9  8\n';
const map2Layout = '12\n34\n5\n6\n';

const createRoomsFromTemplate = (layout: string, metadata: any[] = []) => {
    let mapArray: any = [];
    let currentRow = [];
    let rooms: Array<Room> = [];

    for (var index = 0; index < layout.length; index++) {
        var element = layout[index];

        if (element !== '\n') {
            currentRow.push(element);
        } else {
            mapArray.push(currentRow);
            currentRow = [];
        }
    }


    mapArray.forEach((row: any[], rowIndex: number) => {
        row.forEach((roomId: string, roomIndex: number) => {
            // ' '-means an empy space between rooms
            if (roomId !== ' ') {
                const room = new Room(roomId);

                const roomPositionOnXAxis = roomIndex * -15; // this is to make each room in the array be placed 15 meters east/negative x-axis from eachother
                const roomPositionOnZAxis = roomIndex * -15; // this is to make each room in the array be placed 15 meters south/negative z-axis from eachother
                const roomPositionOnYAxis = 0; // all rooms are on the same y-axis

                room.position = new Position(roomPositionOnXAxis, roomPositionOnYAxis, roomPositionOnZAxis);

                // Check if any items should be added to the room
                const itemsInRoom = metadata.filter((i: ItemDescription) => i.roomId === roomId);

                if (itemsInRoom.length > 0)
                    room.items = itemsInRoom;

                // check if there was a room before the x-axis
                if (roomIndex !== 0 && row[roomIndex - 1] !== ' ' && row[roomIndex - 1] !== undefined && row[roomIndex - 1] !== null) {
                    room.doors.W = new WallDescription(row[roomIndex - 1]);
                    room.doors.W.targetPosition = new Position((roomIndex - 1) * 12, -2.5, roomIndex * 12);
                }

                // check if there comes a room after current room on the x-axis
                if (roomIndex !== row.length && row[roomIndex + 1] !== ' ' && row[roomIndex + 1] !== undefined && row[roomIndex + 1] !== null) {
                    room.doors.E = new WallDescription(row[roomIndex + 1]);
                    room.doors.E.targetPosition = new Position((roomIndex + 1) * -12, -2.5, roomIndex * 12);
                }

                // check if there is a room with the same x-index/position on the x axis but with different value on z-axis (north)
                if (mapArray[roomIndex - 1] !== null && mapArray[roomIndex - 1] !== undefined) {
                    // we have an array before current array if we are here
                    if (mapArray[roomIndex - 1][roomIndex] !== ' ' && mapArray[roomIndex - 1][roomIndex] !== undefined && mapArray[roomIndex - 1][roomIndex] !== null) {
                        room.doors.N = new WallDescription(mapArray[roomIndex - 1][roomIndex]);
                        room.doors.N.targetPosition = new Position(roomIndex * 12, -2.5, (rowIndex - 1) * 12);
                    }
                }

                // check if there is a room with the same x-index/position on the x axis but with different value on z-axis (south)
                if (mapArray[roomIndex + 1] !== null && mapArray[roomIndex + 1] !== undefined) {
                    // we have an array after current array if we are here
                    if (mapArray[roomIndex + 1][roomIndex] !== ' ' && mapArray[roomIndex + 1][roomIndex] !== undefined && mapArray[roomIndex + 1][roomIndex] !== null) {
                        room.doors.S = new WallDescription(mapArray[roomIndex + 1][roomIndex]);
                        room.doors.S.targetPosition = new Position(roomIndex * 12, -2.5, (rowIndex + 1) * -12);
                    }
                }

                room.setWallColors(colors[Utilities.getRandomInt(0, colors.length - 1)]);
                const roofAndFloorColor = colors[Utilities.getRandomInt(0, colors.length - 1)];
                room.floor.color = roofAndFloorColor;
                room.roof.color = roofAndFloorColor;

                rooms.push(room);
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

function assertTargetPosition(wall: WallDescription, x: number, y: number, z: number) : void {
    if(wall.targetPosition.x !== x || wall.targetPosition.y !== y || wall.targetPosition.z !== z)
        throw 'TARGET POSITION ERROR!!!';
}

rooms.forEach((r: Room, index: number) => {
    switch (index.toString()) {
        case "0":
            assertRoomPosition(r, 0, 0, 0);
            assertTargetPosition(r.doors["E"], -12, -2.5, 0);
            assertTargetPosition(r.doors["S"], 0, -2.5, -12);
            break;
        case "1":
            assertRoomPosition(r, -15, 0, 0);
            assertTargetPosition(r.doors["W"], 0, -2.5, 0);
            assertTargetPosition(r.doors["S"], -12, -2.5, -12);
            break;
        case "2":
            assertRoomPosition(r, 0, 0, -15);
            assertTargetPosition(r.doors["E"], -12, -2.5, -12);
            assertTargetPosition(r.doors["N"], 12, -2.5, 0);
            break;
        case "3":
            assertRoomPosition(r, -15, 0, -15);
            assertTargetPosition(r.doors["W"], 0, -2.5, -12);
            assertTargetPosition(r.doors["N"], -12, -2.5, 0);
            break;
        default:
            break;
    }
});

// export const oneRoomMap: Array<Room> = createRoomsFromTemplate(map1Layout);
export const fourRoomMap: Array<Room> = rooms;

