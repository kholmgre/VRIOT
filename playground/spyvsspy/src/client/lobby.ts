import { LevelFactory } from '../client/levelFactory';
import { Room } from '../shared/rooms';
import { Position } from '../shared/position';
import { ItemDescription } from '../shared/itemDescription';
import { CampaignTemplate, Campaign } from '../campaigns/campaign';

export module Lobby {
    export function CreateLobby(scene: HTMLElement, currentGames: Campaign[], availableCampaigns: CampaignTemplate[]) {
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

        const availableMapsText = createMapOption('Choose campaign', new Position(0, 1, 0.1));
        const availableGamesText = createMapOption('Available games', new Position(0, 1, -0.1));
        availableGamesText.setAttribute('rotation', '0 -180 0');

        const eastWall = room.querySelectorAll('[direction=E]')[0];
        const westWall = room.querySelectorAll('[direction=W]')[0];

        eastWall.appendChild(availableMapsText);
        westWall.appendChild(availableGamesText);

        currentGames.map((c: Campaign, index: number) => {
            const pos = new Position(0, (index * 0.5) * -1, -1.1);
            const game = createGameOption(c.campaign.name, c.players.length + '/' + c.campaign.maxPlayers, pos, c.id);
            westWall.appendChild(game);
        });

        availableCampaigns.map((c: CampaignTemplate, index: number) => {
            const pos = new Position(0, (index * 0.5) * -1, 0.1);
            const map = createMapOption(c.name, pos);
            eastWall.appendChild(map);
        });

        const northWall = room.querySelectorAll('[direction=n]')[0];

        northWall.appendChild(createCharSelector());

        lobbyContainer.appendChild(room);

        scene.appendChild(lobbyContainer);
    }
    function createMapOption(text: string, position: Position) {
        const planeElement = document.createElement('a-plane');
        planeElement.setAttribute('position', position.getPositionString());
        planeElement.setAttribute('startcampaign', '');
        planeElement.setAttribute('map', text);
        planeElement.setAttribute('color', 'black');
        planeElement.setAttribute('heigth', '0.5');
        planeElement.setAttribute('width', '0.5');
        planeElement.setAttribute('side', 'both');

        const element = document.createElement('a-text');
        element.setAttribute('position', '0 0 0.1');
        element.setAttribute('color', 'green');
        element.setAttribute('side', 'double');
        element.setAttribute('value', text);

        planeElement.appendChild(element);

        return planeElement;
    }
    function createGameOption(map: string, players: string, position: Position, campaignId: string) {
        const planeElement = document.createElement('a-plane');
        planeElement.setAttribute('position', position.getPositionString());
        planeElement.setAttribute('choosegame', '');
        planeElement.setAttribute('campaignid', campaignId);

        const element = document.createElement('a-text');
        element.setAttribute('position', position.getPositionString());
        element.setAttribute('color', 'green');
        element.setAttribute('side', 'double');
        element.setAttribute('value', 'Map: ' + map + '. Players:' + players);
        element.setAttribute('rotation', '0 -180 0');

        planeElement.appendChild(element);

        return planeElement;
    }
    function createCharSelector() : HTMLElement {
        const chars = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", 
        "k", "l", "z", "x", "c", "v", "b", "n", "m"];

        const enterNameEntity = document.createElement('a-entity');
        enterNameEntity.setAttribute('id', 'enterNameEntity');
        enterNameEntity.setAttribute('position', '2 -0.5 -0.2');

        const enterNameEntityBackground = document.createElement('a-plane');
        enterNameEntityBackground.setAttribute('heigth', '3');
        enterNameEntityBackground.setAttribute('width', '5');
        enterNameEntityBackground.setAttribute('rotation', '0 180 0');

        chars.forEach((c: string, index: number) => {
            const charPlane = document.createElement('a-plane');
            charPlane.setAttribute('char', c);
            charPlane.setAttribute('position', index.toString());
            charPlane.setAttribute('color', 'red');
            charPlane.setAttribute('side', 'double');
            charPlane.setAttribute('height', '0.2');
            charPlane.setAttribute('width', '0.2');
            charPlane.setAttribute('selectletter', '');

            if(index < 10){
                charPlane.setAttribute('position', index/2 + ' 1.8 -0.1');
            } else if(index >= 10 && index < 19) {
                charPlane.setAttribute('position', (index - 10)/2 + ' 1.5 -0.1');
            } else {
                charPlane.setAttribute('position', (index - 19)/2 + ' 1 -0.1');
            }

            const charText = document.createElement('a-text');
            charText.setAttribute('value', c);
            charText.setAttribute('position', '0.1 0 0');
            charText.setAttribute('color', 'green');
            charText.setAttribute('side', 'double');

            charPlane.appendChild(charText);
            enterNameEntityBackground.appendChild(charPlane);
        });

        const deleteLetterPlane = document.createElement('a-plane');
        deleteLetterPlane.setAttribute('width', '0.5');
        deleteLetterPlane.setAttribute('height', '1');
        deleteLetterPlane.setAttribute('position', '5.5 1.5 -0.1');
        deleteLetterPlane.setAttribute('deleteletter', '');
        deleteLetterPlane.setAttribute('color', 'black');

        const deleteText = document.createElement('a-text');
        deleteText.setAttribute('value', '<--');
        deleteText.setAttribute('position', '-0.1 0 0.1');
        deleteText.setAttribute('side', 'double');
        deleteLetterPlane.appendChild(deleteText);

        const submitNamePlane = document.createElement('a-plane');
        submitNamePlane.setAttribute('width', '0.5');
        submitNamePlane.setAttribute('height', '1');
        submitNamePlane.setAttribute('position', '5.5 0.5 -0.1');
        submitNamePlane.setAttribute('submitname', '');
        submitNamePlane.setAttribute('color', 'black');
        
        const submitText = document.createElement('a-text');
        submitText.setAttribute('value', '|\n|\n->');
        submitText.setAttribute('position', '-0.1 0 0.1');
        submitText.setAttribute('side', 'double');
        submitNamePlane.appendChild(submitText);

        

        enterNameEntityBackground.appendChild(deleteLetterPlane);
        enterNameEntityBackground.appendChild(submitNamePlane);

        enterNameEntity.appendChild(enterNameEntityBackground);

        return enterNameEntity;
    }
}