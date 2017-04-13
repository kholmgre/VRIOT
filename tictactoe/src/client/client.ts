import { GameState } from '../shared/gameState';

declare var io: any;
declare var AFRAME: any;
declare var process: any;
let url: string = process.env.API_URL;

let socket = io.connect('http://localhost:3000', { reconnection: false });
let playerId = '';

window.addEventListener("load", function () {

    const playerElement = document.getElementById('player');
    const cameraElement = document.getElementById('playerCamera');
    let currentGame: GameState = null;

    socket.on('current-games', function(data: any){
        console.log(JSON.stringify(data));
    });

    socket.on('game-state', (gameState: GameState) => {
        console.log(JSON.stringify(gameState))
    });

});