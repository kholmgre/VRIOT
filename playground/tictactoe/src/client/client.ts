import { GameState } from '../shared/gameState';
import { ListGames } from '../shared/listGames';

declare var io: any;
declare var AFRAME: any;
declare var process: any;
let url: string = process.env.API_URL;

let socket = io.connect('http://localhost:3000', { reconnection: false });

window.addEventListener("load", function () {

    let currentGame: GameState = null;

    socket.on('list-games', function (gamesList: ListGames) {
        console.log(JSON.stringify(gamesList));
    });

    socket.on('game-lobby', (gameState: GameState) => {
        socket.join(gameState.id);
    });

    socket.on('game-update', (gameState: GameState) => {
        
    });

    socket.on('game-ended', (GameState: GameState) => {
        socket.leave(GameState.id);
    });

});