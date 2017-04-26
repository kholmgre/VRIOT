import { GameState } from '../shared/gameState';
import { ListGames } from '../shared/listGames';
import { MarkerPlaced } from '../shared/markerPlaced';
import { GameVictory } from '../shared/gameVictory';

export class Client {
	currentGame: any = null;
	socket: any;
	readonly boardElement: HTMLElement = document.getElementById('board');
	currentTurnPlayerId: string;

	constructor(socket: any, debug?: boolean) {

		if (debug === true) {

		} else {
			this.socket = socket;

			this.socket.on('marker-placed', this.gameUpdate.bind(this));
			this.socket.on('game-created', this.gameCreated.bind(this));
			this.socket.on('game-started', this.startGame.bind(this));
			this.socket.on('game-ended', this.endGame.bind(this));
			this.socket.on('player-disconnected', this.gameCancelled.bind(this));
			this.socket.on('game-draw', this.gameDraw.bind(this));

			this.createMenu();
		}
	}

	public createBoard(): void {

		let count = 1;
		let column = 0;
		let row = 0;

		const boardContainer = document.createElement('a-entity');
		boardContainer.setAttribute('position', '0 0 0');

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

			let mtls: Array<number> = [1, 2, 3, 4];
			let mtl = mtls[Math.floor(Math.random() * mtls.length)];

			const html = `<a-obj-model cursor-listener id=${prop} src="#board-obj" mtl="#board-mtl${mtl}" position="${zpos} 0 ${row}" scale="0.2 1 0.2" rotation="0 ${rotation} 0"></a-obj-model>`;

			const newElement = document.createElement('a-entity');
			newElement.innerHTML = html;

			boardContainer.appendChild(newElement);
			count++;
			if (count > 3 && count < 6) {
				row = 0.4;
			} else if (count > 6) {
				row = 0.8;
			}
		};

		boardContainer.setAttribute("position", "-0.5 0 -0.5");

		this.boardElement.appendChild(boardContainer);
	}

	public createMenu(): void {
		// Create plane elements for create game and join game

		this.cleanBoard();

		const menuHtml =
			`<a-entity geometry="primitive: plane; width: 2; height: 0.75;" material="color: white" position="0 0 -0.50" rotation="-90 0 0" text="align: center; color: black; value: Create game; width: 6; zOffset: 0.1" id="creategame" menu-select></a-entity>
			<a-entity geometry="primitive: plane; width: 2; height: 0.75;" material="color: white" position="0 0 0.50" rotation="-90 0 0" text="align: center; color: black; value: Join game; width: 6; zOffset: 0.1" id="joingame" menu-select></a-entity>`;

		this.boardElement.innerHTML = menuHtml;
	}

	public createLobby(): void {
		this.cleanBoard();

		const lobbyHtml =
			`<a-entity geometry="primitive: plane; width: 2; height: 0.75;" material="color: white" position="0 0 0" rotation="-90 0 0" text="align: center; color: black; value: Waiting...; width: 6; zOffset: 0.1"></a-entity>`;

		this.boardElement.innerHTML = lobbyHtml;
	}

	private cleanBoard(): void {
		// Remove board entity from dom
		this.boardElement.innerHTML = '';
	}

	public createGameOver(model: string, message: string): void {
		this.cleanBoard();

		const trophyEntity = document.createElement('a-entity');

		let snd: string = "";
		let scale: string = '';
		let position = '0 0 0';
		let textPosition = '0 0.8 0';

		if (model === "skull") {
			snd = "lose";
			scale = '2 2 2';
		}
		else if (model === "trophy") {
			snd = "win";
			scale = '1 1 1';
			textPosition = '0 2 0';
		}

		const trophyEntityObjHtml =
			`<a-obj-model src="#${model}-obj" mtl="#${model}-mtl" position="${position}" scale="${scale}">
				<a-entity geometry="primitive: plane; width: 2; height: 0.75;" material="color: transparent; opacity: 0" position="${textPosition}" rotation="0 0 0" material="shader: flat;" text="align: center; color: white; value: ${message}; width: 6; zOffset: 0.1"></a-entity>
			</a-obj-model>`;

		trophyEntity.innerHTML = trophyEntityObjHtml;

		trophyEntity.setAttribute('sound', `src:#${snd}; autoplay: true`);

		this.boardElement.appendChild(trophyEntity);

		console.log(this.boardElement.getAttribute('position'));
		console.log(trophyEntity.getAttribute('position'));

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
		if (gameVictory.winningPlayerId === this.socket.id) {
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

		let mtlsIndexes: Array<number> = [1, 2];
		let mtlindex = mtlsIndexes[Math.floor(Math.random() * mtlsIndexes.length)];

		if (markerPlaced.playerName === 'Cross') {
			src = '#cross-obj';
			mtl = '#cross-mtl' + mtlindex;
		} else if (markerPlaced.playerName === 'Circle') {
			src = '#circle-obj';
			mtl = '#circle-mtl' + mtlindex;
		} else {
			throw 'Unacceptable playername';
		}

		const html = `<a-obj-model src="${src}" mtl="${mtl}" position="${position}" scale="${scale}"></a-obj-model>`;
		element.innerHTML = html;

		element.setAttribute('sound', 'src:#place; autoplay: true');

		boxElement.appendChild(element);

		let fxElement: HTMLElement = document.createElement("a-plane");

		fxElement.setAttribute('src', '#placement');
		fxElement.setAttribute('rotation', '-90 0 0');
		fxElement.setAttribute('visible', 'true');
		fxElement.setAttribute('opacity', '0.9');
		fxElement.setAttribute('position', '0 0.12 0');
		fxElement.setAttribute('scale', '2 2 2');
		fxElement.setAttribute('height', '1');
		fxElement.setAttribute('width', '1');

		const rotationAnimation = document.createElement('a-animation');
		rotationAnimation.setAttribute('attribute', 'rotation');
		rotationAnimation.setAttribute('ease', 'ease-out');
		rotationAnimation.setAttribute('dur', '1000');
		rotationAnimation.setAttribute('fill', 'forwards');
		rotationAnimation.setAttribute('to', '-90 0 360');
		rotationAnimation.setAttribute('repeat', '3');

		const scaleAnimation = document.createElement('a-animation');
		scaleAnimation.setAttribute('attribute', 'scale');
		scaleAnimation.setAttribute('ease', 'ease-in');
		scaleAnimation.setAttribute('dur', '3500');
		scaleAnimation.setAttribute('fill', 'forwards');
		scaleAnimation.setAttribute('to', '0 0 0');
		scaleAnimation.setAttribute('repeat', '0');

		fxElement.appendChild(rotationAnimation);
		fxElement.appendChild(scaleAnimation);

		element.appendChild(fxElement);
	}
}
