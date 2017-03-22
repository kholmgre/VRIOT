import { Utilities } from './utilities';
import { LevelFactory } from './levelFactory';
import { Game } from './game';
import { GameState } from './gameState';
import { DoorOpened, PlayerChangedRoom, PlayerMoved, PlayerLeft, YouJoined } from './events/events';
import { PlayerMoveCommand } from './commands/commands';
import { Player } from './player';

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

            let target = '';

            let playerElement = document.getElementById('player');

            if (this.getAttribute('type') === 'door') {
                target = this.parentEl.getAttribute('target');
            } else {
                target = this.parentEl.parentEl.getAttribute('target');
            }

            // Are we keeping track of current room still?
            socket.emit('player-change-room', new DoorOpened(playerElement.getAttribute('currentroom'), target, currentGame.playerId, currentGame.gameId));
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

            socket.emit('player-move', playerMoveCommand);
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

    socket.on('player-joined', function (event: Player) {
        currentGame.playerJoined(event);        
    });

    socket.on('door-opened', function (event: DoorOpened) {
        currentGame.doorOpened(event);
    });

    socket.on('player-changed-room-event', function (event: PlayerChangedRoom) {
        currentGame.playerChangedRoom(event);
    });

    socket.on('player-move', function (event: PlayerMoved) {
        currentGame.playerMoved(event);
    });

    socket.on('player-left', function (event: PlayerLeft) {
        currentGame.playerLeft(event);
    });
});

