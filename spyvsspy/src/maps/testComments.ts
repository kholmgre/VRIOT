// This is a manual test, should be tested via unit-testing
// function assertRoomPosition(room: Room, x: number, y: number, z: number): void {
//     if (room.position.x !== x || room.position.y !== y || room.position.z !== z)
//         throw 'Room ' + room.id + ' position not correct!';
// }

// function assertTargetPosition(wall: WallDescription, x: number, y: number, z: number): void {
//     if (wall.targetPosition.x !== x || wall.targetPosition.y !== y || wall.targetPosition.z !== z)
//         throw 'TARGET POSITION ERROR!!!';
// }

// rooms.forEach((r: Room, index: number) => {
//     switch (index.toString()) {
//         case "0":
//             assertRoomPosition(r, 0, 0, 0);
//             assertTargetPosition(r.doors["E"], -12, 0, 0);
//             assertTargetPosition(r.doors["S"], 0, 0, -12);
//             break;
//         case "1":
//             assertRoomPosition(r, -15, 0, 0);
//             assertTargetPosition(r.doors["W"], -3, 0, 0);
//             assertTargetPosition(r.doors["S"], -15, 0, -12);
//             break;
//         case "2":
//             assertRoomPosition(r, 0, 0, -15);
//             assertTargetPosition(r.doors["E"], -12, 0, -15);
//             assertTargetPosition(r.doors["N"], 0, 0, -3);
//             break;
//         case "3":
//             assertRoomPosition(r, -15, 0, -15);
//             assertTargetPosition(r.doors["W"], -3, 0, -15);
//             assertTargetPosition(r.doors["N"], -15, 0, -3);
//             break;
//         default:
//             break;
//     }
// });