import { GameState } from '../shared/gameState';
import { ListGames } from '../shared/listGames';
import { MarkerPlaced } from '../shared/markerPlaced';

export class Client {
    currentGame: GameState = null;
    socket: any;
    readonly boardElement: HTMLElement = document.getElementById('board');

    constructor(socket: any) {
        this.socket = socket;

        this.socket.on('marker-placed', this.gameUpdate.bind(this));
        this.socket.on('game-created', this.gameCreated.bind(this));
        this.socket.on('game-started', this.startGame.bind(this));
        this.socket.on('game-ended', this.endGame.bind(this));
        this.socket.on('player-disconnected', this.gameCancelled.bind(this));

        this.createMenu();
    }

    public createBoard(): void {

        let count = 1;
        let column = 0;
        let row = 0;

        for (const prop in this.currentGame.board.boxes) {

            let zpos = 0;

            if (count === 1 || count === 4 || count === 7) {
                zpos = 0;
            } else if (count === 2 || count === 5 || count === 8) {
                zpos = 0.4;
            } else if (count === 3 || count === 6 || count === 9) {
                zpos = 0.8;
            }

            const html = '<a-obj-model id="' + prop + '" src="#board-obj" mtl="#board-mtl" position="' + row + ' 0 ' + zpos + '" scale="0.2 1 0.2"></a-obj-model>';

            const newElement = document.createElement('a-entity');
            newElement.setAttribute('id', prop);
            newElement.setAttribute('cursor-listener', '');
            newElement.innerHTML = html;

            this.boardElement.appendChild(newElement);
            count++;
            if (count > 3 && count < 6) {
                row = 0.4;
            } else if (count > 6) {
                row = 0.8;
            }
        };
    }

    private createMenu(): void {
        // Create plane elements for create game and join game

        this.cleanBoard();

        const menuHtml =
            `<a-box position='0 0 0' material='opacity: 1;'>
            <a-plane position="0 0.7 0.2" rotation="-90 0 0" height="0.4" width="1" menu-select color="red" id="newgame">
                <a-text value="New game" color="black" sides="both" rotation="0 0 0" position="-0.5 -0.4 0.1"></a-text>
            </a-plane>
            <a-plane position="0 0.7 -0.2" rotation="-90 0 0" height="0.4" width="1" menu-select color="green" id="joingame">
                <a-text value="Join game" color="black" sides="both" rotation="0 0 0" position="-0.5 0.4 0.1"></a-text>
            </a-plane>
        </a-box>`;

        this.boardElement.innerHTML = menuHtml;
    }

    private createLobby(): void {
        this.cleanBoard();

        const lobbyHtml =
            `<a-box position='0 0 0' material='opacity: 0.5;'>
            <a-text value="Waiting.." id="newgame" sides="both" rotation="-90 0 0" menu-select position="-0.5 0.5 -0.3"></a-text>
        </a-box>`;

        this.boardElement.innerHTML = lobbyHtml;
    }

    private createUi(): void {
        // Create element that shows wich player has the current turn
    }

    private cleanBoard(): void {
        // Remove board entity from dom
        this.boardElement.innerHTML = '';
    }

    private createGameOver(winningPlayer: string, message?: string): void {
        // Create element to show winning players name
        console.log(`Player ${winningPlayer} won!`);

        this.cleanBoard();

        // Display trophy or skull, display winning player name

        setTimeout(() => {
            this.createMenu();
        });
    }

    private placeMarker(boxId: string): void {

    }

    gameCreated(gameState: GameState): void {
        // Show lobby
        this.currentGame = gameState;
        this.createLobby();
    }

    // Alert player that game was cancelled, cleanup and create display menu
    gameCancelled(reason: string): void {
        this.createGameOver(this.currentGame.board.winner);

        setTimeout(() => {
            this.createMenu();
            this.currentGame = null;
        });
    }

    startGame(gameState: GameState): void {
        console.log('starting game');
        console.log(gameState);
        this.currentGame = gameState;
        this.cleanBoard();
        // Create board
        this.createBoard();
    }

    endGame(): void {
        this.createGameOver(this.currentGame.board.winner);

        setTimeout(() => {
            this.createMenu();
        }, 8000);
    }

    gameUpdate(markerPlaced: MarkerPlaced): void {
        const boxElement = document.getElementById(markerPlaced.boxId);

        let element: HTMLElement = null;
        const position = '0 0 0';
        const scale = '0.2 1 0.2';

        if (markerPlaced.playerName === 'Cross') {
            element = document.createElement('a-obj-model');
            element.setAttribute('src', '#cross-obj');
            element.setAttribute('mtl', '#cross-mtl');
            element.setAttribute('position', position);
            element.setAttribute('scale', position);
        } else if (markerPlaced.playerName === 'Circle') {
            element = document.createElement('a-obj-model');
            element.setAttribute('src', '#circle-obj');
            element.setAttribute('mtl', '#circle-mtl');
            element.setAttribute('position', position);
            element.setAttribute('scale', position);
        }

        boxElement.appendChild(element);
    }
}