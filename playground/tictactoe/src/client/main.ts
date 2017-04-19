import { Client } from './client';

declare var io: any;
declare var process: any;
declare var AFRAME: any;
const url: string = process.env.API_URL;

window.addEventListener("load", function () {
	const socket = io.connect('https://localhost:3000', { reconnection: false });

	AFRAME.registerComponent('menu-select', {
		init: function () {
			this.el.addEventListener('click', function (evt: any) {
				// check element id, send message with name of element id
				// to create or join game
				if (evt.currentTarget.id === 'newgame') {
					console.log('creating game');
					socket.emit('create-game');
				} else {
					// Not sure if this is the best place to handle the join channel logic
					console.log('joining game');
					socket.emit('join-game');
				}
			});
		}
	});

	AFRAME.registerComponent('cursor-listener', {
		init: function () {
			this.el.addEventListener('click', function (evt: any) {
				// check element id, send message with name "place-marker"
				if (client.currentGame.playerCurrentTurn === socket.id) {
					socket.emit('place-marker', evt.currentTarget.id);
				}
			});
		}
	});

	const client = new Client(socket);
	client.createBoard();
});
