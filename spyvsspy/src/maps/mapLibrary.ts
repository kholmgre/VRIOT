import { Room, WallDescription } from '../rooms';
import { colors } from './colors';

function getRandomInt(max: number, min: number) : number {
    return Math.floor(Math.random() * max) + min;  
}

const map1Layout = '1AB\n2 6\n3457\n9  8\n';

let mapArr: any = [];
let currentRow = [];
let rooms: Array<Room> = [];

for (var index = 0; index < map1Layout.length; index++) {
    var element = map1Layout[index];

    if (element !== '\n') {
        currentRow.push(element);
    } else {
        mapArr.push(currentRow);
        currentRow = [];
    }
}

mapArr.forEach((c: any[], rowsIndex: number) => {
    c.forEach((r: string, rowIndex: number) => {
        if(r !== ' '){
            // check metadata for room details
            const room = new Room(r);
            
            // check if there was a room before on this row
            if(rowIndex !== 0 && c[rowIndex - 1] !== ' ' && c[rowIndex - 1] !== undefined && c[rowIndex - 1] !== null){
                room.doors.W = new WallDescription(c[rowIndex - 1]);
            }

            if(rowIndex !== c.length && c[rowIndex + 1] !== ' ' && c[rowIndex + 1] !== undefined && c[rowIndex + 1] !== null){
                room.doors.E = new WallDescription(c[rowIndex + 1]);
            }

            // now check if there was a row before or if there is a row after and if there is a room with the same index
            if(mapArr[rowsIndex - 1] !== null && mapArr[rowsIndex - 1] !== undefined){
                if(mapArr[rowsIndex - 1][rowIndex] !== ' ' && mapArr[rowsIndex - 1][rowIndex] !== undefined && mapArr[rowsIndex - 1][rowIndex] !== null){
                    room.doors.N = new WallDescription(mapArr[rowsIndex - 1][rowIndex]);
                }
            }

            if(mapArr[rowsIndex + 1] !== null && mapArr[rowsIndex + 1] !== undefined){
                if(mapArr[rowsIndex + 1][rowIndex] !== ' ' && mapArr[rowsIndex + 1][rowIndex] !== undefined && mapArr[rowsIndex + 1][rowIndex] !== null){
                    room.doors.S = new WallDescription(mapArr[rowsIndex + 1][rowIndex]);
                }
            }

            room.setWallColors(colors[getRandomInt(0, colors.length - 1)]);
            room.floor.color = colors[getRandomInt(0, colors.length - 1)];
            room.roof.color = colors[getRandomInt(0, colors.length - 1)];

            rooms.push(room);
        }
    });
});

export const oneRoomMap: Array<Room> = rooms;

