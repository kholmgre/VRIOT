import { Utilities } from '../shared/utilities';
import { LevelFactory } from './levelFactory';
import { Game } from './game';
import { GameState } from '../server/gameState';
import { DoorOpened, PlayerChangedRoom, PlayerMoved, PlayerLeft, YouJoined, PlayerJoined } from '../events/events';
import { PlayerMoveCommand, OpenDoorCommand } from '../commands/commands';

import { Position } from '../shared/position';

declare var io: any;
declare var AFRAME: any;
declare var process: any;
let url: string = process.env.API_URL;

let socket = io.connect('http://localhost:3000', { reconnection: false });
let playerName = Utilities.generateGuid();
let currentGame: Game = null;
let playerId = '';

AFRAME.registerComponent('open-door', {
    init: function () {
        this.el.addEventListener('click', function (evt: any) {

            let positionInTargetRoom = '';
            let currentRoomId = '';
            let targetRoomId = '';

            let playerElement: any = document.getElementById('player');

            if (playerElement.is('no-move'))
                return;

            if (this.getAttribute('type') === 'door') {
                positionInTargetRoom = this.parentEl.getAttribute('target');
                currentRoomId = this.parentEl.parentEl.getAttribute('id');
                targetRoomId = this.parentEl.getAttribute('target-room-id');
            } else {
                positionInTargetRoom = this.parentEl.parentEl.getAttribute('target');
                currentRoomId = this.parentEl.parentEl.parentEl.getAttribute('id');
                targetRoomId = this.parentEl.parentEl.getAttribute('target-room-id');
            }

            const currentPos: any = playerElement.getAttribute('position');
            const newPos = positionInTargetRoom.split(' ');

            const openDoorCommand = new OpenDoorCommand(currentRoomId, targetRoomId, currentGame.playerId, currentGame.gameId);

            socket.emit('open-door-command', openDoorCommand);
        });
    }
});

AFRAME.registerComponent('changemovestate', {
    init: function () {
        this.el.addEventListener('click', function (evt: any) {
            let playerElement: any = document.getElementById('player');

            if (playerElement.is('movestate')) {
                playerElement.removeState('movestate');
            } else {
                playerElement.addState('movestate');
            }
        });
    }
});

AFRAME.registerComponent('movearea', {
    init: function () {
        this.el.addEventListener('click', function (evt: any) {
            let playerElement: any = document.getElementById('player');

            if (!playerElement.is('movestate'))
                return;

            let newPos = evt.detail.intersection.point;
            newPos.y = playerElement.getAttribute('position').y;

            const playerMoveCommand = new PlayerMoveCommand(currentGame.gameId, currentGame.playerId, playerElement.getAttribute('position'), newPos);

            socket.emit('player-move-command', playerMoveCommand);
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

window.addEventListener("load", function () {

    socket.emit('join', playerName);

    socket.on('you-joined', function (event: YouJoined) {
        currentGame = new Game(playerName, 'scene', socket, event.gameState.id, event.playerId);
        currentGame.joinedGame(event);
    });

    socket.on('player-joined', function (event: PlayerJoined) {
        currentGame.playerJoined(event);
    });

    socket.on('door-opened', function (event: DoorOpened) {
        currentGame.doorOpened(event);
    });

    socket.on('player-move', function (event: PlayerMoved) {
        currentGame.playerMoved(event);
    });

    socket.on('player-left', function (event: PlayerLeft) {
        currentGame.playerLeft(event);
    });

    socket.on("disconnect", function () {
        currentGame.playerDisconnected();
    });
});

