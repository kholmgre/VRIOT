import { Utilities } from './utilities';
import { LevelFactory } from './LevelFactory';
declare var io: any;
declare var AFRAME: any;

let socket = io.connect('http://localhost:3000', { reconnection: false });
let playerName = Utilities.generateGuid();
let scareUsers: boolean = false;

AFRAME.registerComponent('open-door', {
    init: function () {
        this.el.addEventListener('click', function (evt: any) {

            let target = '';

            let playerElement = document.getElementById('player');

            if (this.getAttribute('type') === 'door') {
                target = this.parentEl.getAttribute('target');
            } else {
                target = this.parentEl.parentEl.getAttribute('target');
            }

            socket.emit('player-move', { currentRoom: playerElement.getAttribute('currentroom'), targetRoom: target, player: playerName });
        });
    }
});

AFRAME.registerComponent('open-inventory-listener', {
    init: function () {
        this.el.addEventListener('click', function (evt: any) {
            let inventoryElement = document.createElement('a-plane');
            inventoryElement.setAttribute('position', '0 2.6 0');
            inventoryElement.setAttribute('rotation', '90 0 -90');
            inventoryElement.setAttribute('id', 'inventory');

            let exitElement = document.createElement('a-plane');
            exitElement.setAttribute('value', 'X');
            exitElement.setAttribute('position', '0 0.4 0.05');
            exitElement.setAttribute('rotation', '0 0 -90');
            exitElement.setAttribute('scale', '0.2 0.2 1');
            exitElement.setAttribute('color', 'green');
            exitElement.setAttribute('close-inventory-listener', '');

            inventoryElement.appendChild(exitElement);

            let playerElement = document.getElementById('player');
            playerElement.appendChild(inventoryElement);
        });
    }
});

AFRAME.registerComponent('close-inventory-listener', {
    init: function () {
        this.el.addEventListener('click', function (evt: any) {
            let inventoryElement = document.getElementById('inventory');

            inventoryElement.parentNode.removeChild(inventoryElement);
        });
    }
});

AFRAME.registerComponent('game-timer', {
    init: () => {
        let time = 180;
        setInterval(() => {

            time = time - 1;

            let timeElement = document.getElementById('timer');

            timeElement.setAttribute('value', time.toString());
        }, 1000);
    }
});

AFRAME.registerComponent('player-pos', {
    init: function(evt: any){
        // setInterval(() => {console.log(this.el.getAttribute('position'));}, 1000);
    }
})

window.addEventListener("load", function () {

    socket.emit('join', playerName);

    socket.on('you-joined', function (data: any) {

        console.debug('you have joined the game');

        let scene = document.getElementById('scene');

        let rooms = LevelFactory.createRooms(data.template);

        for (let player in data.players) {
            if (player === playerName)
                continue;

            let enemyElement = document.createElement('a-entity');
            enemyElement.setAttribute('id', data.players[player].Name);

            let enemyAvatar = document.createElement('a-image');
            enemyAvatar.setAttribute('src', 'spy.jpeg');
            enemyAvatar.setAttribute('side', 'double');
            enemyAvatar.setAttribute('visible', 'true');

            enemyElement.appendChild(enemyAvatar);
            let roomElement = document.getElementById(data.players[player].Room);
            let pos: any = roomElement.getAttribute('position');
            pos.y = 1.8;
            enemyElement.setAttribute('position', pos);
            scene.appendChild(enemyElement);
        }

        rooms.forEach((room: any) => {
            if (room.getAttribute("id") === data.players[playerName].Room) {
                let playerElement = document.getElementById('player');
                playerElement.setAttribute('currentroom', room.id);

                let roomPos = room.components.position.attrValue;

                playerElement.setAttribute('position', roomPos);
            }

            scene.appendChild(room);
        });
    });

    socket.on('player-joined', function (state: any) {

        console.debug(state.playerData.Name + ' have joined the game');

        let scene = document.getElementById('scene');

        let enemyElement = document.createElement('a-entity');
        enemyElement.setAttribute('id', state.playerData.Name);

        let enemyAvatar = document.createElement('a-image');
        enemyAvatar.setAttribute('src', 'spy.jpeg');
        enemyAvatar.setAttribute('side', 'double');
        enemyAvatar.setAttribute('visible', 'true');

        enemyElement.appendChild(enemyAvatar);
        let roomElement = document.getElementById(state.playerData.Room);
        let pos: any = roomElement.getAttribute('position');
        pos.y = 1.8;
        enemyElement.setAttribute('position', pos);

        scene.appendChild(enemyElement);

    });

    /* 
     * This event notifies the all clients that a door has been opened and they should update
     * the dom to reflect this. The door should turn black to signify it has been opened (both in the 
     * room where the door was opened but also in the connecting room). This logic could possibly be
     * handled in the player-moved event.
    */
    socket.on('door-opened', function (data: any) {
        // TODO: only send to clients except sender client. 
        if (data.sender === playerName)
            return;

        let fromWall: any = document.getElementById(data.moveInfo.from.id).querySelectorAll('[type=wallcontainer]')[0];
        let fromDoor: any = fromWall.querySelectorAll('[type=door]')[0];
        let fromdoorknob: any = fromWall.querySelectorAll('[type=doorknob]')[0];

        let roomTargetId = fromWall.getAttribute('target');

        let targetRoom = document.getElementById(roomTargetId);
        let toWall: any = targetRoom.querySelectorAll('[type=wallcontainer][direction=' + Utilities.getOppositeDirection(fromWall.getAttribute('direction')) + ']')[0];
        let toDoor: any = toWall.querySelectorAll('[type=door]')[0];
        let todoorknob: any = toWall.querySelectorAll('[type=doorknob]')[0];
        toDoor.setAttribute('color', '#000000');

        // This is not a very good solution but it should work atm. The issue it solves is that after the player
        // had looked at the doorknob and started the move animation, the door got the open-door component and would
        // emit the player-move event again wich was not correct behaviour
        setTimeout(() => {
            // If the user looks at the door it will get transported to correc target 
            toDoor.setAttribute('open-door', '');
            fromDoor.setAttribute('open-door', '');
        }, 2000);

        // TODO: remove doorknob elements in connecting rooms..
    });

    /*
    * This event should notify the sender client that it is ok to move the player to a new room and location (and play animation for example).
    * The other clients will use this event do for example display the user avatar if they are in the same room. 
    */
    socket.on('player-moved', function (state: any) {

        // Separate this logic?
        if (state.player === playerName) {
            let entity: any = document.querySelector('[sound]');

            entity.components.sound.playSound();

            let playerElement: any = document.getElementById('player');
            playerElement.setAttribute('currentroom', state.move.to.id);

            setTimeout(() => {
                let targetRoom = document.getElementById(state.move.to.id);
                let targetRoomPos: any = targetRoom.getAttribute('position');

                let playerNewPos: any = { x: targetRoomPos.x, y: targetRoomPos.y, z: targetRoomPos.z };

                let moveAnimation = document.createElement('a-animation');
                moveAnimation.setAttribute('attribute', 'position');
                // NOTE!!!! If this duration is higher, the player will not be moved to the next room. It must be lower than the milliseconds intervall for the nested setTimeout that actually changes the 
                // players position
                moveAnimation.setAttribute('dur', '2400');
                moveAnimation.setAttribute('fill', 'forwards');

                let targetWallInCurrentRoom: any = document.getElementById(state.move.from.id).querySelectorAll('[direction=' + state.move.from.direction + ']')[0];
                let targetDoorInCurrentRoom: any = targetWallInCurrentRoom.querySelectorAll('[type=door]')[0];
                targetDoorInCurrentRoom.setAttribute('color', '#000000');

                socket.emit('door-opened', { moveInfo: state.move });

                let doorPosition = targetWallInCurrentRoom.getAttribute('position');

                // this is to not move the camera through the door

                if (doorPosition.x > 0)
                    doorPosition.x = doorPosition.x - 0.20;

                if (doorPosition.z > 0)
                    doorPosition.z = doorPosition.z - 0.20;

                let animationEndPosition = doorPosition.x + ' ' + playerElement.getAttribute('position').y + ' ' + doorPosition.z;
                moveAnimation.setAttribute('to', animationEndPosition);

                playerElement.appendChild(moveAnimation);

                setTimeout(() => {

                    let number = Utilities.getRandomInt(0, 20);

                    playerElement.setAttribute('position', playerNewPos);

                    if (number === 19 && scareUsers === true) {
                        let samara = document.createElement('a-entity');
                        samara.setAttribute('id', 'samara');
                        samara.setAttribute('position', '3 3.5 3');

                        let avatar = document.createElement('a-image');
                        avatar.setAttribute('src', 'lol.png');
                        avatar.setAttribute('position', '0 0 0');

                        let sound = document.createElement('a-sound');
                        sound.setAttribute('src', 'lol.mp3');
                        sound.setAttribute('autoplay', 'true');
                        sound.setAttribute('loop', 'infinite');

                        let animation = document.createElement('a-animation');
                        animation.setAttribute('attribute', 'position');
                        animation.setAttribute('dur', '10000');
                        animation.setAttribute('fill', 'forwards');
                        animation.setAttribute('to', '0 3.5 0');

                        samara.appendChild(avatar);
                        samara.appendChild(sound);
                        samara.appendChild(animation);

                        let player = document.getElementById('player');

                        player.appendChild(samara);
                    }
                }, 2500);
            }, 1200);
        } else {
            let enemyElement = document.getElementById(state.player);

            let roomElement = document.getElementById(state.room);
            let newPos: any = roomElement.getAttribute('position');
            newPos.y = newPos.y + 2;
            enemyElement.setAttribute('position', newPos);
        }
    });

    socket.on('player-left', function (data: any) {
        console.debug('removing ' + data + ' element');
        let enemyEntity: any = document.getElementById(data);
        console.debug('parentEl ' + enemyEntity.parentEl);
        enemyEntity.parentEl.removeChild(enemyEntity);
        console.debug(data + ' has left the building.');
    });
});

