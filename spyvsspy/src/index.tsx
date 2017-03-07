import { Utilities } from './utilities';
import { LevelFactory } from './LevelFactory';
declare var io: any;
declare var AFRAME: any;

let playerName = Utilities.generateGuid();
console.debug(playerName);

let socket = io.connect('http://localhost:3000', { reconnection: false });

AFRAME.registerComponent('open-door', {
    init: function () {
        this.el.addEventListener('click', function (evt: any) {

            let target = this.getAttribute('target');

            let playerElement = document.getElementById('player');

            socket.emit('player-move', { currentRoom: playerElement.getAttribute('currentroom'), targetRoom: target, player: playerName, doorElementId: this.parentEl.getAttribute('id') });
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
            console.log('close inventory');
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

window.addEventListener("load", function () {

    socket.emit('join', playerName);

    socket.on('joined', function (state: any) {

        let scene = document.getElementById('scene');

        if (state.playerData.Name !== playerName) {
            // store somewhere? react on disconnect and other states?

            let enemyElement = document.createElement('a-entity');
            enemyElement.setAttribute('id', state.playerData.Name);

            let enemyAvatar = document.createElement('a-image');
            enemyAvatar.setAttribute('src', 'spy.jpeg');
            enemyAvatar.setAttribute('side', 'double');
            enemyAvatar.setAttribute('visible', 'true');
            enemyAvatar.setAttribute('position', '0 0 -2');

            enemyElement.appendChild(enemyAvatar);
            let roomElement = document.getElementById(state.playerData.Room);
            enemyElement.setAttribute('position', roomElement.getAttribute('position'));

            scene.appendChild(enemyElement);
        } else {
            let rooms = LevelFactory.createRooms(state.template);

            rooms.forEach((room: any) => {
                if (room.getAttribute("id") === state.players[playerName].Room) {
                    let playerElement = document.getElementById('player');
                    playerElement.setAttribute('currentroom', room.id);

                    let roomPos = room.components.position.attrValue;

                    playerElement.setAttribute('position', roomPos);
                }

                scene.appendChild(room);
            });
        }
    });

    socket.on('player-moved', function (state: any) {

        console.log(state);

        if (state.player === playerName) {
            let entity: any = document.querySelector('[sound]');

            entity.components.sound.playSound();

            setTimeout(() => {
                let target = document.getElementById(state.room);
                let targetPos: any = target.getAttribute('position');

                let newPos: any = { x: targetPos.x, y: targetPos.y, z: targetPos.z };

                let playerElement: any = document.getElementById('player');

                let moveAnimation = document.createElement('a-animation');
                moveAnimation.setAttribute('attribute', 'position');
                moveAnimation.setAttribute('dur', '2500');
                moveAnimation.setAttribute('fill', 'forwards');

                let targetDoor: any = document.getElementById(state.doorElementId);

                let doorPosition = targetDoor.parentEl.getAttribute('position');

                // this is to not move the camera through the door

                if (doorPosition.x > 0)
                    doorPosition.x = doorPosition.x - 0.20;

                if (doorPosition.z > 0)
                    doorPosition.z = doorPosition.z - 0.20;

                let animationEndPosition = doorPosition.x + ' ' + playerElement.getAttribute('position').y + ' ' + doorPosition.z;
                moveAnimation.setAttribute('to', animationEndPosition);

                // Set state instead?
                // if (this.getAttribute('opened') === 'false') {
                //     this.setAttribute('opened', 'true');
                //     this.parentEl.parentEl.setAttribute('color', '#000000');
                // }

                // this.parentEl.setAttribute('color', '#000000');

                playerElement.appendChild(moveAnimation);

                setTimeout(() => {
                    playerElement.setAttribute('position', newPos);

                    let number = Utilities.getRandomInt(0, 20);

                    if (number === 19) {
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
                }, 2550);
            }, 1200);
        } else {
            let enemyElement = document.getElementById(state.player);

            let roomElement = document.getElementById(state.room);
            enemyElement.setAttribute('position', roomElement.getAttribute('position'));
        }
    });
});

