import { Room } from './rooms';
import { Player } from './player';
import { LevelFactory } from './levelFactory';
import { GameState } from './gameState';
import { DoorOpened, PlayerChangedRoom, PlayerMoved, PlayerLeft, YouJoined } from './events/events';
import { Utilities } from './utilities';
import { Position } from './position';

export class Game {
    scene: HTMLElement;
    playerName: string;
    playerId: string;
    player: HTMLElement;
    socket: any;
    gameId: string;

    constructor(playerName: string, sceneId: string, socket: any, gameId: string, playerId: string) {
        this.scene = document.getElementById(sceneId);
        this.playerName = playerName;
        this.socket = socket;
        this.player = document.getElementById('player');
        this.gameId = gameId;
        this.playerId = playerId;
    }

    joinedGame(event: YouJoined): void {

        this.playerId = event.playerId;

        let rooms = LevelFactory.createRooms(event.gameState.rooms);

        rooms.forEach((room: HTMLElement) => {
            this.scene.appendChild(room);
        });

        const pos = event.gameState.players.find((p: Player) => { return p.id === this.playerId }).position;

        this.player.setAttribute('position', new Position(pos.x, pos.y, pos.z).getPositionString());
        this.player.setAttribute('currentroom', '1');

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

                enemyElement.setAttribute('position', new Position(pos.x, pos.y, pos.z).getPositionString());

                this.scene.appendChild(enemyElement);
            });
        }, 1);
    }

    playerJoined(event: Player): void {
        // Create new enemy obj
        let enemyElement = document.createElement('a-entity');
        enemyElement.setAttribute('id', event.id);
        enemyElement.setAttribute('position', event.position.getPositionString());

        let enemyAvatar = document.createElement('a-sprite');
        enemyAvatar.setAttribute('src', 'spy' + Utilities.getRandomInt(1, 3) + '.png');
        enemyAvatar.setAttribute('position', '0 1.5 0');

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

        let fromWall: any = document.getElementById(event.sourceId).querySelectorAll('[type=wallcontainer]')[0];
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
    }

    playerChangedRoom(event: PlayerChangedRoom): void {
        // Separate this logic?
        if (event.playerId === this.playerId) {
            // let entity: any = document.querySelector('[sound]');

            // entity.components.sound.playSound();

            let playerElement: any = document.getElementById('player');
            playerElement.setAttribute('currentroom', event.to.targetId);

            let targetRoom = document.getElementById(event.to.targetId);
                let targetRoomPos: any = targetRoom.getAttribute('position');

                let playerNewPos: any = { x: targetRoomPos.x, y: targetRoomPos.y, z: targetRoomPos.z };
                playerElement.setAttribute('position', playerNewPos);

            // setTimeout(() => {
            //     let targetRoom = document.getElementById(event.to.targetId);
            //     let targetRoomPos: any = targetRoom.getAttribute('position');

            //     let playerNewPos: any = { x: targetRoomPos.x, y: targetRoomPos.y, z: targetRoomPos.z };

            //     let moveAnimation = document.createElement('a-animation');
            //     moveAnimation.setAttribute('attribute', 'position');
            //     // NOTE!!!! If this duration is higher, the player will not be moved to the next room. It must be lower than the milliseconds intervall for the nested setTimeout that actually changes the 
            //     // players position
            //     moveAnimation.setAttribute('dur', '2400');
            //     moveAnimation.setAttribute('fill', 'forwards');

            //     let targetWallInCurrentRoom: any = document.getElementById(event.from.sourceId).querySelectorAll('[direction=' + event.from.direction + ']')[0];
            //     let targetDoorInCurrentRoom: any = targetWallInCurrentRoom.querySelectorAll('[type=door]')[0];
            //     targetDoorInCurrentRoom.setAttribute('color', '#000000');

            //     let doorPosition = targetWallInCurrentRoom.getAttribute('position');

            //     if (doorPosition.x > 0)
            //         doorPosition.x = doorPosition.x - 0.20;

            //     if (doorPosition.z > 0)
            //         doorPosition.z = doorPosition.z - 0.20;

            //     let animationEndPosition = doorPosition.x + ' ' + playerElement.getAttribute('position').y + ' ' + doorPosition.z;
            //     moveAnimation.setAttribute('to', animationEndPosition);

            //     playerElement.appendChild(moveAnimation);

            //     setTimeout(() => {

            //         let number = Utilities.getRandomInt(0, 20);
            //         this.socket.emit('door-opened', { moveInfo: new DoorOpened(event.from.sourceId, event.to.targetId, event.playerId, this.gameId) });
            //         playerElement.setAttribute('position', playerNewPos);
            //     }, 2500);
            // }, 1200);
        } else {
            let enemyElement = document.getElementById(event.playerId);
            let roomElement = document.getElementById(event.to.targetId);
            let roomPos: any = roomElement.getAttribute('position');
            roomPos.y = roomPos.y + 2;
            roomPos.z = roomPos.z + 2;

            enemyElement.setAttribute('position', roomPos);
        }
    }

    playerMoved(event: PlayerMoved): void {
        let elemToMove = null;
        let posY = 0;

        if (event.playerId === this.playerId) {
            elemToMove = document.getElementById('player');
        } else {
            elemToMove = document.getElementById(event.playerId);
        }

        let pos: any = elemToMove.getAttribute('position');
        posY = pos.y;

        let animation = document.createElement('a-animation');
        animation.setAttribute('attribute', 'position');
        animation.setAttribute('dur', '1000');
        animation.setAttribute('fill', 'forwards');

        const newPos = new Position(event.desiredPosition.x, event.desiredPosition.y, event.desiredPosition.z);

        animation.setAttribute('to', newPos.getPositionString());

        elemToMove.appendChild(animation);
    }

    playerLeft(event: PlayerLeft): void {
        let enemyEntity: any = document.getElementById(event.playerId);
        enemyEntity.parentEl.removeChild(enemyEntity);
        console.debug(event.playerId + ' has left the building.');
    }
}