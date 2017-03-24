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

    mapArr.forEach((c: any[], rowsIndex: number) => {
        c.forEach((r: string, rowIndex: number) => {
            if (r !== ' ') {
                // check metadata for room details
                const room = new Room(r);

                const itemsInRoom = metadata.filter((i: ItemDescription) => i.roomId === r);

                if(itemsInRoom.length > 0)
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
            }
        });
    });

    return rooms;
};

const items = [new ItemDescription(new Position(1, 0, 0), "a-text", { "value" : "X", "color" : "red", "rotation" : "-90 0 0", "position" : "-4 1.5 0" }, "1"), 
new ItemDescription(new Position(1, 0, 0), "a-text", { "value" : "Z", "color" : "red", "rotation" : "-90 0 0", "position" : "0 1.5 -4" }, "1")];

const itemExample = items;

export const oneRoomMap: Array<Room> = createRoomsFromTemplate(map1Layout);
export const fourRoomMap: Array<Room> = createRoomsFromTemplate(map2Layout, itemExample);

