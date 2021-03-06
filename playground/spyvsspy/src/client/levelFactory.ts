import { Room, WallDescription } from '../shared/rooms';
import { ItemDescription } from '../shared/itemDescription';
import { Position } from '../shared/position';

export module LevelFactory {
    export function createRooms(rooms: Array<Room>): Array<HTMLElement> {
        function getPosition(direction: string) {

            let position = { x: '0', y: '0', z: '0' }

            switch (direction) {
                case 'N':
                    position.z = "5";
                    break;
                case 'S':
                    position.z = "-5";
                    break;
                case 'E':
                    position.x = '-5';
                    break;
                case 'W':
                    position.x = '5';
                    break;
            }

            return position.x + ' ' + position.y + ' ' + position.z;
        }

        function getdoorknobPosition(direction: string) {
            let position = { x: '0.6', y: '0', z: '0' }

            switch (direction) {
                case 'N':
                    position.z = "-0.01";
                    break;
                case 'S':
                    position.z = "0.01";
                    break;
                case 'E':
                    position.z = '0.01';
                    break;
                case 'W':
                    position.z = '-0.01';
                    break;
            }

            return position.x + ' ' + position.y + ' ' + position.z;
        }

        function getRotation(direction: string) {
            let rotation = { x: '0', y: '0', z: '0' }

            switch (direction) {
                case 'W':
                    rotation.y = "90";
                    break;
                case 'E':
                    rotation.y = "90";
                    break;
            }

            return rotation.x + ' ' + rotation.y + ' ' + rotation.z;
        }

        function createWall(direction: string, color: string) {
            let wall = document.createElement('a-plane');

            wall.setAttribute('color', color);
            wall.setAttribute('position', getPosition(direction));
            wall.setAttribute('rotation', getRotation(direction));
            wall.setAttribute('height', '4');
            wall.setAttribute('width', '10');
            wall.setAttribute('side', 'double');
            wall.setAttribute('direction', direction);

            return wall;
        }

        function createConnectingWall(currentRoomId: string, wallPosition: WallDescription, direction: string, color: string) {

            const position = new Position(null, null, null, wallPosition.targetPosition);

            let wall = document.createElement('a-entity');
            wall.setAttribute('position', getPosition(direction));
            wall.setAttribute('target', position.getPositionString());
            wall.setAttribute('target-room-id', wallPosition.targetRoom);
            wall.setAttribute('direction', direction);
            wall.setAttribute('type', 'wallcontainer');

            let doorEl = document.createElement('a-plane');
            doorEl.setAttribute('position', '0 0 0');
            doorEl.setAttribute('type', 'door');
            doorEl.setAttribute('rotation', getRotation(direction));
            doorEl.setAttribute('height', '4');
            doorEl.setAttribute('width', '2');
            doorEl.setAttribute('side', 'double');

            let doorTargetSign = document.createElement('a-text');
            doorTargetSign.setAttribute('side', 'double');
            doorTargetSign.setAttribute('color', 'green');
            doorTargetSign.setAttribute('value', wallPosition.targetRoom);
            doorTargetSign.setAttribute('position', getdoorknobPosition(direction));
            doorEl.appendChild(doorTargetSign);

            if (wallPosition.open === true) {
                doorEl.setAttribute('color', '#000000');
                doorEl.setAttribute('open-door', '');
            } else {
                doorEl.setAttribute('color', '#FF7562');

                let doorknob = document.createElement('a-circle');
                doorknob.setAttribute('color', '#000000');
                doorknob.setAttribute('type', 'doorknob');
                doorknob.setAttribute('open-door', '');
                doorknob.setAttribute('position', getdoorknobPosition(direction));
                doorknob.setAttribute('height', '1');
                doorknob.setAttribute('width', '1');
                doorknob.setAttribute('radius', '0.05');
                doorknob.setAttribute('side', 'double');
                doorEl.appendChild(doorknob);
            }

            let wall1 = document.createElement('a-plane');
            wall1.setAttribute('color', color);

            // TODO: refactor

            if (direction === 'N' || direction === 'S')
                wall1.setAttribute('position', '-3 0 0');

            if (direction === 'W' || direction === 'E')
                wall1.setAttribute('position', '0 0 -3');

            wall1.setAttribute('rotation', getRotation(direction));
            wall1.setAttribute('height', '4');
            wall1.setAttribute('id', 'wall1');
            wall1.setAttribute('width', '4');
            wall1.setAttribute('side', 'double');

            let wall2 = document.createElement('a-plane');
            wall2.setAttribute('id', 'wall2');
            wall2.setAttribute('color', color);
            if (direction === 'N' || direction === 'S')
                wall2.setAttribute('position', '3 0 0');

            if (direction === 'W' || direction === 'E')
                wall2.setAttribute('position', '0 0 3');

            wall2.setAttribute('rotation', getRotation(direction));
            wall2.setAttribute('height', '4');
            wall2.setAttribute('width', '4');
            wall2.setAttribute('side', 'double');

            wall.appendChild(doorEl);
            wall.appendChild(wall1);
            wall.appendChild(wall2);

            return wall;
        }

        const mappedRooms = rooms.map((room: Room, index: number) => {

            let roomElement = document.createElement('a-entity');
            roomElement.setAttribute('id', room.id);

            let floor = document.createElement('a-plane');
            floor.setAttribute('color', room.floor.color);
            floor.setAttribute('width', '10');
            floor.setAttribute('height', '10');
            floor.setAttribute('position', '0 -2 0');
            floor.setAttribute('rotation', '-90 0 90');
            floor.setAttribute('side', 'double');
            floor.setAttribute('movearea', '');

            let roof = document.createElement('a-plane');
            roof.setAttribute('color', room.floor.color);
            roof.setAttribute('width', '10');
            roof.setAttribute('height', '10');
            roof.setAttribute('position', '0 2 0');
            roof.setAttribute('rotation', '-90 0 90');
            roof.setAttribute('side', 'double');

            roomElement.appendChild(floor);
            roomElement.appendChild(roof);

            function createW(direction: any, room: any, roomElement: HTMLElement): void {
                // Room definition makes this code hard. Disabled it by using any typing
                if (room.doors[direction].targetPosition !== null && room.doors[direction].targetPosition !== undefined) {
                    let wall = createConnectingWall(room.id, room.doors[direction], direction, room.doors.E.color);
                    roomElement.appendChild(wall);
                } else {
                    let wall = createWall(direction, room.doors.E.color);
                    roomElement.appendChild(wall);
                }
            }

            // Create connecting rooms
            createW("E", room, roomElement);
            createW("W", room, roomElement);
            createW("N", room, roomElement);
            createW("S", room, roomElement);

            const position = new Position(null, null, null, room.position);

            roomElement.setAttribute('position', position.getPositionString());

            room.items.forEach((i: ItemDescription) => {
                const itemElement = document.createElement(i.elementType);

                for (var key in i.elementValues) {
                    if (i.elementValues.hasOwnProperty(key)) {
                        itemElement.setAttribute(key, i.elementValues[key])
                    }
                }

                roomElement.appendChild(itemElement);
            });

            return roomElement;
        });

        return mappedRooms;
    }
}