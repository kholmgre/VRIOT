export class LevelFactory {
    static createRooms(template: any) {
        function getPosition(direction: string) {

            let position = { x: '0', y: '3.5', z: '0' }

            switch (direction) {
                case 'N':
                    position.x = "5";
                    break;
                case 'S':
                    position.x = "-5";
                    break;
                case 'E':
                    position.z = '-5';
                    break;
                case 'W':
                    position.z = '5';
                    break;
            }

            return position.x + ' ' + position.y + ' ' + position.z;
        }

        function getDoorknobPosition(direction: string) {
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
                case 'N':
                    rotation.y = "90";
                    break;
                case 'S':
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

            return wall;
        }

        function createConnectingWall(currentRoomId: string, targetRoomId: string, direction: string, color: string) {

            let wall = document.createElement('a-entity');
            wall.setAttribute('position', getPosition(direction));

            let door = document.createElement('a-plane');
            door.setAttribute('color', '#FF7562');
            door.setAttribute('position', '0 0 0');
            door.setAttribute('rotation', getRotation(direction));
            door.setAttribute('height', '4');
            door.setAttribute('width', '2');
            door.setAttribute('side', 'double');
            door.setAttribute('id', targetRoomId + currentRoomId);

            let doorKnob = document.createElement('a-circle');
            doorKnob.setAttribute('color', '#000000');
            doorKnob.setAttribute('open-door', '');
            doorKnob.setAttribute('target', targetRoomId);
            doorKnob.setAttribute('position', getDoorknobPosition(direction));
            doorKnob.setAttribute('height', '1');
            doorKnob.setAttribute('width', '1');
            doorKnob.setAttribute('radius', '0.05');
            doorKnob.setAttribute('side', 'double');

            door.appendChild(doorKnob);

            let wall1 = document.createElement('a-plane');
            wall1.setAttribute('color', color);

            // TODO: refactor

            if (direction === 'N' || direction === 'S')
                wall1.setAttribute('position', '0 0 3');

            if (direction === 'W' || direction === 'E')
                wall1.setAttribute('position', '3 0 0');

            wall1.setAttribute('rotation', getRotation(direction));
            wall1.setAttribute('height', '4');
            wall1.setAttribute('width', '4');
            wall1.setAttribute('side', 'double');

            let wall2 = document.createElement('a-plane');
            wall2.setAttribute('color', color);
            if (direction === 'N' || direction === 'S')
                wall2.setAttribute('position', '0 0 -3');

            if (direction === 'W' || direction === 'E')
                wall2.setAttribute('position', '-3 0 0');

            wall2.setAttribute('rotation', getRotation(direction));
            wall2.setAttribute('height', '4');
            wall2.setAttribute('width', '4');
            wall2.setAttribute('side', 'double');

            wall.appendChild(door);
            wall.appendChild(wall1);
            wall.appendChild(wall2);

            return wall;
        }

        let rooms = template.rooms.map((room: any) => {

            let roomElement = document.createElement('a-entity');
            roomElement.setAttribute('id', room.Id);

            let floor = document.createElement('a-plane');
            floor.setAttribute('color', room.Colors.Floor);
            floor.setAttribute('width', '10');
            floor.setAttribute('height', '10');
            floor.setAttribute('position', '0 1.5 0');
            floor.setAttribute('rotation', '-90 0 90');
            floor.setAttribute('side', 'double');

            let roof = document.createElement('a-plane');
            roof.setAttribute('color', room.Colors.Floor);
            roof.setAttribute('width', '10');
            roof.setAttribute('height', '10');
            roof.setAttribute('position', '0 5.5 0');
            roof.setAttribute('rotation', '-90 0 90');
            roof.setAttribute('side', 'double');

            roomElement.appendChild(floor);
            roomElement.appendChild(roof);

            let createdWalls: any = { "N": "", "S": "", "W": "", "E": "" };

            // Create connecting rooms
            for (let direction in room.Directions) {
                let wall = createConnectingWall(room.Id, room.Directions[direction], direction, room.Colors.Wall);
                createdWalls[direction] = wall;
                roomElement.appendChild(wall);
            }

            for (let dir in createdWalls) {
                if (createdWalls[dir] === "") {
                    let wall = createWall(dir, room.Colors.Wall);
                    createdWalls[dir] = wall;
                    roomElement.appendChild(wall);
                }
            }

            return roomElement;
        });

        rooms.forEach((room: any, index: number, array: Array<any>) => {
            let pos = '0 ' + index * 5 + ' 0';
            room.setAttribute('position', pos);
        });

        return rooms;
    }
}