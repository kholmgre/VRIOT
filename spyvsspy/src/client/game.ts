import { Room } from '../shared/rooms';
import { Player } from '../shared/player';
import { LevelFactory } from './levelFactory';
import { GameState } from '../server/gameState';
import { DoorOpened, PlayerChangedRoom, PlayerMoved, PlayerLeft, YouJoined } from '../events/events';
import { Utilities } from '../shared/utilities';
import { Position } from '../shared/position';

export class Game {
    scene: HTMLElement;
    playerName: string;
    playerId: string;
    player: HTMLElement;
    socket: any;
    gameId: string;
    playerCamera: HTMLElement;

    constructor(playerName: string, sceneId: string, socket: any, gameId: string, playerId: string) {
        this.scene = document.getElementById(sceneId);
        this.playerName = playerName;
        this.socket = socket;
        this.player = document.getElementById('player');
        this.gameId = gameId;
        this.playerId = playerId;
        this.playerCamera = document.getElementById('playerCamera');
    }

    joinedGame(event: YouJoined): void {

        this.playerId = event.playerId;

        let rooms = LevelFactory.createRooms(event.gameState.rooms);

        rooms.forEach((room: HTMLElement) => {
            this.scene.appendChild(room);
        });

        const pos = event.gameState.players.find((p: Player) => { return p.id === this.playerId }).position;

        this.player.setAttribute('position', new Position(pos.x, pos.y, pos.z).getPositionString());


        // Hack because the dom had to update with the changes in the room forEach above.. Use mutation observers? Something native to a-frame?
        setTimeout(() => {

            event.gameState.players.forEach((p: Player) => {
                if (p.id === this.playerId)
                    return;

                let enemyElement = document.createElement('a-entity');
                enemyElement.setAttribute('id', p.id);

                let enemyAvatar = document.createElement('a-sprite');
                enemyAvatar.setAttribute('src', 'spy' + Utilities.getRandomInt(1, 3) + '.png');

                let enemyName = document.createElement('a-text');
                enemyName.setAttribute('position', '-1 0.5 0');
                enemyName.setAttribute('side', 'double');
                enemyName.setAttribute('value', p.name);
                enemyName.setAttribute('color', 'red');

                enemyAvatar.appendChild(enemyName);
                enemyElement.appendChild(enemyAvatar);

                enemyElement.setAttribute('position', new Position(null, null, null, p.position).getPositionString());

                this.scene.appendChild(enemyElement);
            });
        }, 1);
    }

    playerJoined(event: Player): void {
        // conversion to get access to getPositionString member function
        const pos = new Position(null, null, null, event.position);

        let enemyElement = document.createElement('a-entity');
        enemyElement.setAttribute('id', event.id);
        enemyElement.setAttribute('position', pos.getPositionString());

        let enemyAvatar = document.createElement('a-sprite');
        enemyAvatar.setAttribute('src', 'spy' + Utilities.getRandomInt(1, 3) + '.png');
        enemyAvatar.setAttribute('position', '0 2 0');

        let enemyName = document.createElement('a-text');
        enemyName.setAttribute('position', '-1 0.5 0');
        enemyName.setAttribute('side', 'double');
        enemyName.setAttribute('value', event.name);
        enemyName.setAttribute('color', 'red');

        enemyAvatar.appendChild(enemyName);

        enemyElement.appendChild(enemyAvatar);

        this.scene.appendChild(enemyElement);
    }

    doorOpened(event: DoorOpened): void {
        // TODO: only send to clients except sender client. 

        // There could be more than one door?
        let currentRoomWall: any = document.getElementById(event.sourceId).querySelectorAll('[type=wallcontainer][target-room-id="' + event.targetId + '"]')[0];
        let currentRoomWallDoor: any = currentRoomWall.querySelectorAll('[type=door]')[0];
        let currentRoomWallDoorKnob: any = currentRoomWall.querySelectorAll('[type=doorknob]')[0];
        currentRoomWallDoor.setAttribute('color', '#000000');

        let targetRoom = document.getElementById(event.targetId);
        let toWall: any = targetRoom.querySelectorAll('[type=wallcontainer][direction=' + Utilities.getOppositeDirection(currentRoomWall.getAttribute('direction')) + ']')[0];
        let toDoor: any = toWall.querySelectorAll('[type=door]')[0];
        let todoorknob: any = toWall.querySelectorAll('[type=doorknob]')[0];
        toDoor.setAttribute('color', '#000000');

        // This is not a very good solution but it should work atm. The issue it solves is that after the player
        // had looked at the doorknob and started the move animation, the door got the open-door component and would
        // emit the player-move event again wich was not correct behaviour
        setTimeout(() => {
            // If the user looks at the door it will get transported to correc target 
            toDoor.setAttribute('open-door', '');
            currentRoomWallDoor.setAttribute('open-door', '');
        }, 3500);

        // TODO: remove doorknob elements in connecting rooms..
    }

    playerMoved(event: PlayerMoved): void {
        let elemToMove: any = null;

        if (event.playerId === this.playerId) {
            elemToMove = document.getElementById('player');
        } else {
            elemToMove = document.getElementById(event.playerId);
        }

        if (event.throughDoor === true) {
            // Attach entities to each player and play the one that matches playerId
            let entity: any = document.querySelector('[sound]');

            entity.components.sound.playSound();

            setTimeout(() => {
                const newPos = new Position(event.desiredPosition.x, event.desiredPosition.y - 3, event.desiredPosition.z);

                let moveAnimation = document.createElement('a-animation');
                moveAnimation.setAttribute('attribute', 'position');
                // NOTE!!!! If this duration is higher, the player will not be moved to the next room. It must be lower than the milliseconds intervall for the nested setTimeout that actually changes the 
                // players position
                moveAnimation.setAttribute('dur', '2400');
                moveAnimation.setAttribute('fill', 'forwards');

                let targetWallInCurrentRoom: any = document.getElementById(event.room).querySelectorAll('[direction=' + event.direction + ']')[0];

                const roomEntityPosition: any = targetWallInCurrentRoom.parentEl.getAttribute('position');

                const doorRelativePosition: any = targetWallInCurrentRoom.getAttribute('position');

                const newPostition = new Position(roomEntityPosition.x + doorRelativePosition.x, (roomEntityPosition.y + doorRelativePosition.y) - 2.5, roomEntityPosition.z + doorRelativePosition.z);
                
                moveAnimation.setAttribute('to', newPostition.getPositionString());

                elemToMove.appendChild(moveAnimation);

                setTimeout(() => {
                    elemToMove.setAttribute('position', newPos.getPositionString());
                }, 2500);
            }, 1200);
        }

        // let animation = document.createElement('a-animation');
        // animation.setAttribute('attribute', 'position');
        // animation.setAttribute('dur', '1000');
        // animation.setAttribute('fill', 'forwards');

        // const newPos = new Position(event.desiredPosition.x, event.desiredPosition.y, event.desiredPosition.z);

        // animation.setAttribute('to', newPos.getPositionString());

        // elemToMove.appendChild(animation);
    }

    playerLeft(event: PlayerLeft): void {
        let enemyEntity: any = document.getElementById(event.playerId);
        enemyEntity.parentEl.removeChild(enemyEntity);
        console.debug(event.playerId + ' has left the building.');
    }

    playerDisconnected() {
        const disconnectStatus = document.createElement('a-text');
        disconnectStatus.setAttribute('value', 'disconnected');
        disconnectStatus.setAttribute('position', '-1.4 0 -1');
        disconnectStatus.setAttribute('scale', '2');
        disconnectStatus.setAttribute('color', 'red');

        this.playerCamera.appendChild(disconnectStatus);
    }
}