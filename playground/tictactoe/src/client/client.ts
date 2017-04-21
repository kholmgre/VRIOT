import { GameState } from '../shared/gameState';
import { ListGames } from '../shared/listGames';
import { MarkerPlaced } from '../shared/markerPlaced';
import { GameVictory } from '../shared/gameVictory';

export class Client {
	currentGame: GameState = null;
	socket: any;
	readonly boardElement: HTMLElement = document.getElementById('board');
	currentTurnPlayerId: string;

	constructor(socket: any) {
		this.socket = socket;

		this.socket.on('marker-placed', this.gameUpdate.bind(this));
		this.socket.on('game-created', this.gameCreated.bind(this));
		this.socket.on('game-started', this.startGame.bind(this));
		this.socket.on('game-ended', this.endGame.bind(this));
		this.socket.on('player-disconnected', this.gameCancelled.bind(this));
		this.socket.on('game-draw', this.gameDraw.bind(this));

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

			let rotations: Array<number> = [0, 90, 180, 270];
			let rotation = rotations[Math.floor(Math.random() * rotations.length)];

			const html = `<a-obj-model cursor-listener id=${prop} src="#board-obj" mtl="#board-mtl" position="${zpos} 0 ${row}" scale="0.2 1 0.2" rotation="0 ${rotation} 0"></a-obj-model>`;

			//const html = '<a-obj-model cursor-listener id="' + prop + '" src="#board-obj" mtl="#board-mtl" position="' + zpos + ' 0 ' + row + '" scale="0.2 1 0.2" rotation="${asd} 0 0"></a-obj-model>';

			this.boardElement.setAttribute("position", "-0.5 0 -0.5");

			const newElement = document.createElement('a-entity');
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
					<a-text font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt" value="New game" color="black" side="both" rotation="0 0 0" position="-0.5 -0.4 0.1"></a-text>
				</a-plane>
				<a-plane position="0 0.7 -0.2" rotation="-90 0 0" height="0.4" width="1" menu-select color="green" id="joingame">
					<a-text font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt" value="Join game" color="black" side="both" rotation="0 0 0" position="-0.5 0.4 0.1"></a-text>
				</a-plane>`;

		this.boardElement.innerHTML = menuHtml;
	}

	private createLobby(): void {
		this.cleanBoard();

		const lobbyHtml =
			`<a-box position='0 0 0' material='opacity: 0.5;'>
			<a-text font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt" value="Waiting.." id="newgame" side="both" rotation="-90 0 0" menu-select position="-0.5 0.5 -0.3"></a-text>
		</a-box>`;

		this.boardElement.innerHTML = lobbyHtml;
	}

	private cleanBoard(): void {
		// Remove board entity from dom
		this.boardElement.innerHTML = '';
	}

	private createGameOver(model: string, message: string): void {
		this.cleanBoard();

		const trophyEntity = document.createElement('a-entity');

		let snd: string = "";
		let scale: string = '';

		if (model === "skull") {
			snd = "lose";
			scale = '1 1 1';
		}
		else if (model === "trophy") {
			snd = "win";
			scale = '1 1 1';
		}

		const trophyEntityObjHtml =
			`<a-obj-model src="#${model}-obj" mtl="#${model}-mtl" position="0 0 0" scale="${scale}">
				<a-text font= "https://cdn.aframe.io/fonts/Exo2SemiBold.fnt" value="${message}" side="both" rotation="0 0 0" position="-1 1.5 0"></a-text>
			</a-obj-model>`;

		trophyEntity.innerHTML = trophyEntityObjHtml;

		trophyEntity.setAttribute('sound', 'src: #${snd}, autoplay: true')

		this.boardElement.appendChild(trophyEntity);

		setTimeout(() => {
			this.currentGame = null;
			this.currentTurnPlayerId = null;
			this.cleanBoard();
			this.createMenu();
		}, 10000);
	}

	private resetElementPosition() {

	}

	gameCreated(gameState: GameState): void {
		this.currentGame = gameState;
		this.createLobby();
	}

	gameCancelled(message: string): void {
		this.createGameOver('trophy', message);
	}

	gameDraw(message: string): void {
		this.createGameOver('skull', message);
	}

	startGame(gameState: GameState): void {
		this.currentGame = gameState;
		this.currentTurnPlayerId = gameState.playerCurrentTurn.id;
		this.cleanBoard();
		this.createBoard();
	}

	endGame(gameVictory: GameVictory): void {
		if(gameVictory.winningPlayerId === this.socket.id){
			this.createGameOver('trophy', `You won!`);
		} else {
			this.createGameOver('skull', `You lost!`);
		}
	}

	gameUpdate(markerPlaced: MarkerPlaced): void {
		const boxElement = document.getElementById(markerPlaced.boxId);

		this.currentTurnPlayerId = markerPlaced.currentTurnPlayerId;

		let element: HTMLElement = document.createElement('a-obj-model');
		const position = '0 0.15 0';
		const scale = '1 1 1';
		let src = '';
		let mtl = '';

		if (markerPlaced.playerName === 'Cross') {
			src = '#cross-obj';
			mtl = '#cross-mtl';
		} else if (markerPlaced.playerName === 'Circle') {
			src = '#circle-obj';
			mtl = '#circle-mtl';
		} else {
			throw 'Unacceptable playername';
		}

		const html = `<a-obj-model src="${src}" mtl="${mtl}" position="${position}" scale="${scale}"></a-obj-model>`;
		element.innerHTML = html;

		element.setAttribute('sound', 'src:#place; autoplay: true');

		boxElement.appendChild(element);

		let fxElement: HTMLElement = document.createElement("a-plane");

		const fxHtml = `<a-plane src="#placement" opacity="0.9" position="0 0.06 0" height="1" width="1" rotation="-90 0 0">
							<a-animation attribute="rotation" ease="ease-out" dur="1000" fill="forwards" to="-90 360 0" repeat="3"></a-animation>
							<a-animation attribute="scale" ease="ease-in" dur="3500" fill="forwards" to="0 0 0" repeat="0"></a-animation>
						</a-plane>`;

		fxElement.innerHTML = fxHtml;

		element.appendChild(fxElement);
	}
}
