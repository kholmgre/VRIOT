import { GameState, } from '../shared/gameState';
import { ListGames } from '../shared/listGames';
import { GameStatus } from '../server/gameSession';

export class Client {
	//currentGame: GameState = null; // Production
	currentGame: any = null; // Debug
	socket: any;
	readonly boardElement: HTMLElement = document.getElementById('board');

	constructor(socket: any) {
		this.socket = socket;

		this.socket.on('game-update', this.gameUpdate.bind(this));
		this.socket.on('game-created', this.gameCreated.bind(this));
		this.socket.on('game-started', this.startGame.bind(this));
		this.socket.on('game-ended', this.createGameOver.bind(this));
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

			this.boardElement.setAttribute("position", "-0.5 0 -0.5");

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
			`<a-box position='0 0 0' material='opacity: 0.5;'>
			<a-text value="New game" id="newgame" sides="both" rotation="-90 0 0" menu-select position="-0.5 0.5 0.3"></a-text>
			<a-text value="Join game" id="joingame" sides="both" rotation="-90 0 0" menu-select position="-0.5 0.5 -0.3"></a-text>
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

	private createGameOver(winningPlayer: string): void {
		// Create element to show winning players name
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
		this.cleanBoard();
		// Create board
		this.createBoard();
	}

	endGame(): void {
		this.createGameOver();

		setTimeout(() => {
			this.createMenu();
		}, 8000);
	}

	gameUpdate(gameState: GameState) {
		// examine changes in state and update accordingly
		// an update can be one of two things:
		// a player has placed a marker
		// or the game is over
		// if a player has moved this should be represented by an animation of placing the marker
		// if a player has won, the screen should fade to black and the winning players name showed
		// after x seconds, set currentGame to null and return to lobby
	}
}
