/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = __webpack_require__(3);
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["Lobby"] = 0] = "Lobby";
    GameStatus[GameStatus["InProgress"] = 1] = "InProgress";
    GameStatus[GameStatus["Finished"] = 2] = "Finished";
    GameStatus[GameStatus["Draw"] = 3] = "Draw";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
function generateGuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
class GameSession {
    constructor(startedByPlayer) {
        this.players = [];
        this.id = generateGuid();
        this.status = GameStatus.Lobby;
        this.board = new board_1.Board();
        this.addPlayer(startedByPlayer);
    }
    addPlayer(player) {
        if (this.players.length < 2) {
            this.players.push(player);
        }
        if (this.players.length === 2) {
            this.startGame();
        }
    }
    startGame() {
        this.status = GameStatus.InProgress;
        this.playerCurrentTurn = this.players[0];
    }
    placeMarker(playerId, boxId) {
        if (playerId !== this.playerCurrentTurn.id) {
            console.log('Player tried to place marker when it was not that players turn..');
            return false;
        }
        const markerPlaced = this.board.placeMarker(playerId, boxId);
        if (markerPlaced === true) {
            if (this.board.finished === true) {
                if (this.board.winner === null) {
                    this.status = GameStatus.Draw;
                }
                else {
                    this.status = GameStatus.Finished;
                }
            }
            else {
                this.playerCurrentTurn = this.players.find((p) => p.id !== playerId);
            }
            return true;
        }
        else {
            return false;
        }
    }
}
exports.GameSession = GameSession;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.Player = Player;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("chai");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class BoxState {
    constructor() {
        this.checked = false;
    }
    placeMarker(playerId) {
        this.checked = true;
        this.byPlayer = playerId;
    }
}
class Board {
    constructor() {
        this.boxes = {
            1: new BoxState(),
            2: new BoxState(),
            3: new BoxState(),
            4: new BoxState(),
            5: new BoxState(),
            6: new BoxState(),
            7: new BoxState(),
            8: new BoxState(),
            9: new BoxState()
        };
    }
    placeMarker(playerId, boxId) {
        if (this.boxes[boxId] === null || this.boxes[boxId] === undefined)
            return false;
        if (this.boxes[boxId].checked === true) {
            return false;
        }
        this.boxes[boxId].placeMarker(playerId);
        this.checkVictoryConditions(playerId);
        return true;
    }
    checkVictoryConditions(playerId) {
        console.log(JSON.stringify(this));
        if (this.checkBox("1", playerId) === true && this.checkBox("2", playerId) === true && this.checkBox("3", playerId) === true)
            this.playerWon(playerId);
        if (this.checkBox("4", playerId) === true && this.checkBox("5", playerId) === true && this.checkBox("6", playerId) === true)
            this.playerWon(playerId);
        if (this.checkBox("7", playerId) === true && this.checkBox("8", playerId) === true && this.checkBox("9", playerId) === true)
            this.playerWon(playerId);
        if (this.checkBox("1", playerId) === true && this.checkBox("4", playerId) === true && this.checkBox("7", playerId) === true)
            this.playerWon(playerId);
        if (this.checkBox("2", playerId) === true && this.checkBox("5", playerId) === true && this.checkBox("8", playerId) === true)
            this.playerWon(playerId);
        if (this.checkBox("3", playerId) === true && this.checkBox("6", playerId) === true && this.checkBox("9", playerId) === true)
            this.playerWon(playerId);
        if (this.checkBox("1", playerId) === true && this.checkBox("5", playerId) === true && this.checkBox("9", playerId) === true)
            this.playerWon(playerId);
        if (this.checkBox("3", playerId) === true && this.checkBox("5", playerId) === true && this.checkBox("7", playerId) === true)
            this.playerWon(playerId);
        let allBoxesChecked = true;
        for (let box in this.boxes) {
            if (this.boxes[box].checked === false)
                allBoxesChecked = false;
        }
        if (allBoxesChecked === true && this.winner === null) {
            this.draw();
        }
    }
    draw() {
        this.finished = true;
        this.winner = null;
    }
    playerWon(playerId) {
        this.winner = playerId;
        this.finished = true;
    }
    checkBox(boxId, playerId) {
        const checkedByPlayer = this.boxes[boxId].byPlayer === playerId && this.boxes[boxId].checked;
        return checkedByPlayer;
    }
}
exports.Board = Board;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const gameSession_1 = __webpack_require__(0);
const player_1 = __webpack_require__(1);
const chai_1 = __webpack_require__(2);
__webpack_require__(5);
describe('GameSession', () => {
    describe('Victory condition', () => {
        it('should set state of gameSession to finished', () => {
            const player1 = new player_1.Player('1', 'Cross');
            const player2 = new player_1.Player('1', 'Circle');
            const session = new gameSession_1.GameSession(player1);
            session.addPlayer(player2);
            console.log(JSON.stringify(session));
            chai_1.expect(session.status.valueOf()).to.be.equal(gameSession_1.GameStatus.InProgress.valueOf());
        });
    });
});


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("mocha");

/***/ })
/******/ ]);