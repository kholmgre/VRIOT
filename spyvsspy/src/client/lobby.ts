import { LevelFactory } from '../client/levelFactory';
import { Room } from '../shared/rooms';
import { Position } from '../shared/position';
import { ItemDescription } from '../shared/itemDescription';
import { JoinableGame } from '../shared/joinableGame';

export module Lobby {
    export function CreateLobby(scene: HTMLElement, currentGames: JoinableGame[], availableMaps: any[]) {
        const lobbyContainer = document.createElement('a-entity');
        lobbyContainer.setAttribute('position', '0 10 0');
        lobbyContainer.setAttribute('id', 'lobby');

        const lobbyRoom = new Room("lobbyRoom");
        lobbyRoom.floor.color = 'white';
        lobbyRoom.roof.color = 'white';
        lobbyRoom.setWallColors('white');
        lobbyRoom.position = new Position(0, 0, 0);

        const room = LevelFactory.createRooms([lobbyRoom])[0];

        const items: any[] = [];

        const availableMapsText = createMapOption('Choose map', new Position(-1, 1, 0));
        const availableGamesText = createMapOption('Available games', new Position(0, 1, -0.1));
        availableGamesText.setAttribute('rotation', '0 -180 0');

        const eastWall = room.querySelectorAll('[direction=E]')[0];
        const westWall = room.querySelectorAll('[direction=W]')[0];

        eastWall.appendChild(availableMapsText);
        westWall.appendChild(availableGamesText);

        const northWall = room.querySelectorAll('[direction=n]')[0];

        currentGames.map((g: JoinableGame, index: number) => {
            const pos = new Position(0, (index * 0.5) * -1, -1.1);
            const game = createGameOption(g.map, g.players, pos, g.id);
            westWall.appendChild(game);
        });

        availableMaps.map((m: string, index: number) => {
            const pos = new Position(-1.1, (index * 0.5) * -1, 0);
            const map = createMapOption(m, pos);
            eastWall.appendChild(map);
        });

        lobbyContainer.appendChild(room);

        scene.appendChild(lobbyContainer);
    }
    function createMapOption(text: string, position: Position) {
        const planeElement = document.createElement('a-plane');
        planeElement.setAttribute('position', position.getPositionString());
        planeElement.setAttribute('choosemap', '');
        planeElement.setAttribute('map', text);

        const element = document.createElement('a-text');
        element.setAttribute('position', position.getPositionString());
        element.setAttribute('color', 'green');
        element.setAttribute('side', 'double');
        element.setAttribute('value', text);
        
        planeElement.appendChild(element);

        return planeElement;
    }
    function createGameOption(map: string, players: number, position: Position, gameId: string) {
        const planeElement = document.createElement('a-plane');
        planeElement.setAttribute('position', position.getPositionString());
        planeElement.setAttribute('choosegame', '');
        planeElement.setAttribute('gameid', gameId);

        const element = document.createElement('a-text');
        element.setAttribute('position', position.getPositionString());
        element.setAttribute('color', 'green');
        element.setAttribute('side', 'double');
        element.setAttribute('value', 'Map: ' + map + '. Players:' + players);
        element.setAttribute('rotation', '0 -180 0');
        
        planeElement.appendChild(element);

        return planeElement;
    }
}