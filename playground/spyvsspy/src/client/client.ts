import { Utilities } from '../shared/utilities';
import { LevelFactory } from './levelFactory';
import { LevelInstance } from './game';
import { DoorOpened, PlayerChangedRoom, PlayerMoved, PlayerLeft, JoinedCampaign, PlayerJoined } from '../events/events';
import { PlayerMoveCommand, OpenDoorCommand, StartCampaignCommand, JoinCampaignCommand, ChangeNameCommand, PlayLevelCommand } from '../commands/commands';
import { Connected } from '../shared/connected';
import { Position } from '../shared/position';
import { Lobby } from '../client/lobby';
import * as Placeholders from '../client/placeholders';

declare var io: any;
declare var AFRAME: any;
declare var process: any;
let url: string = process.env.API_URL;

let socket = io.connect('http://localhost:3000', { reconnection: false });
let playerName = Utilities.generateGuid();
let playerId = '';
const lettersSelected: string[] = [];

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

            const openDoorCommand = new OpenDoorCommand(currentRoomId, targetRoomId, playerId);

            socket.emit('open-door-command', openDoorCommand);
        });
    }
});

AFRAME.registerComponent('startcampaign', {
    init: function () {
        this.el.addEventListener('click', function (evt: any) {

            const createGameCommand = new StartCampaignCommand(this.getAttribute('map'));

            socket.emit('start-campaign', createGameCommand);
        });
    }
});

AFRAME.registerComponent('selectletter', {
    init: function () {
        this.el.addEventListener('click', function (evt: any) {

            lettersSelected.push(this.getAttribute('char'));

            console.log(JSON.stringify(lettersSelected));
        });
    }
});

AFRAME.registerComponent('deleteletter', {
    init: function () {
        this.el.addEventListener('click', function (evt: any) {

            lettersSelected.splice(lettersSelected.length - 1, 1);

            console.log(JSON.stringify(lettersSelected));
        });
    }
});

AFRAME.registerComponent('submitname', {
    init: function () {
        this.el.addEventListener('click', function (evt: any) {

            const changeNameCommand = new ChangeNameCommand(lettersSelected.reduce((c: string, acc: string) => c + acc ));

            socket.emit('change-name', changeNameCommand);
        });
    }
});

AFRAME.registerComponent('choosegame', {
    init: function () {
        this.el.addEventListener('click', function (evt: any) {

            const joinGameCommand = new JoinCampaignCommand(this.getAttribute('campaignid'));

            socket.emit('join-game', joinGameCommand);
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

            const playerMoveCommand = new PlayerMoveCommand(playerElement.getAttribute('position'), newPos);

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

    const playerElement = document.getElementById('player');
    const cameraElement = document.getElementById('playerCamera');
    let currentLevel: LevelInstance = null;

    socket.on('connected-to-server', function(event: Connected){
        
        playerId = event.playerId;

        Lobby.CreateLobby(document.getElementById('scene'), event.joinableCampaigns, event.campaigns);
        playerElement.setAttribute('position', '0 6 0');
    });

    socket.on('current-games', function(data: any){
        console.log(JSON.stringify(data));
    });

    socket.on('lobby-wait', function () {
        // Placeholder for waiting for players
        cameraElement.appendChild(Placeholders.Placeholders.LobbyWaiting());
    });

    socket.on('start-level', function(event: PlayLevelCommand){
        currentLevel = new LevelInstance(playerName, 'scene', socket, playerId);

        currentLevel.start(event.level, event.players);

        Placeholders.Placeholders.RemoveLobby();
    });

    socket.on('door-opened', function (event: DoorOpened) {
        currentLevel.doorOpened(event);
    });

    socket.on('player-move', function (event: PlayerMoved) {
        currentLevel.playerMoved(event);
    });

    socket.on('player-left', function (event: PlayerLeft) {
        currentLevel.playerLeft(event);
    });

    socket.on("disconnect", function () {
        currentLevel.playerDisconnected();
    });
});

