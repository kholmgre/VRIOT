import { GameState } from '../shared/gameState';
import { ListGames } from '../shared/listGames';

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

    socket.on('list-games', function(gamesList: ListGames){
        console.log(JSON.stringify(gamesList));
    });

    socket.on('game-state', (gameState: GameState) => {
        console.log(JSON.stringify(gameState))
    });

});