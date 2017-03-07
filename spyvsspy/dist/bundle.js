/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LevelFactory = (function () {
    function LevelFactory() {
    }
    LevelFactory.createRooms = function (template) {
        function getPosition(direction) {
            var position = { x: '0', y: '3.5', z: '0' };
            switch (direction) {
                case 'N':
                    position.x = "5";
                    break;
                case 'S':
                    position.x = "-5";
                    break;
                case 'E':
                    position.z = '-5';
                    break;
                case 'W':
                    position.z = '5';
                    break;
            }
            return position.x + ' ' + position.y + ' ' + position.z;
        }
        function getDoorknobPosition(direction) {
            var position = { x: '0.6', y: '0', z: '0' };
            switch (direction) {
                case 'N':
                    position.z = "-0.01";
                    break;
                case 'S':
                    position.z = "0.01";
                    break;
                case 'E':
                    position.z = '0.01';
                    break;
                case 'W':
                    position.z = '-0.01';
                    break;
            }
            return position.x + ' ' + position.y + ' ' + position.z;
        }
        function getRotation(direction) {
            var rotation = { x: '0', y: '0', z: '0' };
            switch (direction) {
                case 'N':
                    rotation.y = "90";
                    break;
                case 'S':
                    rotation.y = "90";
                    break;
            }
            return rotation.x + ' ' + rotation.y + ' ' + rotation.z;
        }
        function createWall(direction, color) {
            var wall = document.createElement('a-plane');
            wall.setAttribute('color', color);
            wall.setAttribute('position', getPosition(direction));
            wall.setAttribute('rotation', getRotation(direction));
            wall.setAttribute('height', '4');
            wall.setAttribute('width', '10');
            wall.setAttribute('side', 'double');
            return wall;
        }
        function createConnectingWall(currentRoomId, targetRoomId, direction, color) {
            var wall = document.createElement('a-entity');
            wall.setAttribute('position', getPosition(direction));
            var door = document.createElement('a-plane');
            door.setAttribute('color', '#FF7562');
            door.setAttribute('position', '0 0 0');
            door.setAttribute('rotation', getRotation(direction));
            door.setAttribute('height', '4');
            door.setAttribute('width', '2');
            door.setAttribute('side', 'double');
            door.setAttribute('id', targetRoomId + currentRoomId);
            var doorKnob = document.createElement('a-circle');
            doorKnob.setAttribute('color', '#000000');
            doorKnob.setAttribute('open-door', '');
            doorKnob.setAttribute('target', targetRoomId);
            doorKnob.setAttribute('position', getDoorknobPosition(direction));
            doorKnob.setAttribute('height', '1');
            doorKnob.setAttribute('width', '1');
            doorKnob.setAttribute('radius', '0.05');
            doorKnob.setAttribute('side', 'double');
            door.appendChild(doorKnob);
            var wall1 = document.createElement('a-plane');
            wall1.setAttribute('color', color);
            if (direction === 'N' || direction === 'S')
                wall1.setAttribute('position', '0 0 3');
            if (direction === 'W' || direction === 'E')
                wall1.setAttribute('position', '3 0 0');
            wall1.setAttribute('rotation', getRotation(direction));
            wall1.setAttribute('height', '4');
            wall1.setAttribute('width', '4');
            wall1.setAttribute('side', 'double');
            var wall2 = document.createElement('a-plane');
            wall2.setAttribute('color', color);
            if (direction === 'N' || direction === 'S')
                wall2.setAttribute('position', '0 0 -3');
            if (direction === 'W' || direction === 'E')
                wall2.setAttribute('position', '-3 0 0');
            wall2.setAttribute('rotation', getRotation(direction));
            wall2.setAttribute('height', '4');
            wall2.setAttribute('width', '4');
            wall2.setAttribute('side', 'double');
            wall.appendChild(door);
            wall.appendChild(wall1);
            wall.appendChild(wall2);
            return wall;
        }
        var rooms = template.rooms.map(function (room) {
            var roomElement = document.createElement('a-entity');
            roomElement.setAttribute('id', room.Id);
            var floor = document.createElement('a-plane');
            floor.setAttribute('color', room.Colors.Floor);
            floor.setAttribute('width', '10');
            floor.setAttribute('height', '10');
            floor.setAttribute('position', '0 1.5 0');
            floor.setAttribute('rotation', '-90 0 90');
            floor.setAttribute('side', 'double');
            var roof = document.createElement('a-plane');
            roof.setAttribute('color', room.Colors.Floor);
            roof.setAttribute('width', '10');
            roof.setAttribute('height', '10');
            roof.setAttribute('position', '0 5.5 0');
            roof.setAttribute('rotation', '-90 0 90');
            roof.setAttribute('side', 'double');
            roomElement.appendChild(floor);
            roomElement.appendChild(roof);
            var createdWalls = { "N": "", "S": "", "W": "", "E": "" };
            for (var direction in room.Directions) {
                var wall = createConnectingWall(room.Id, room.Directions[direction], direction, room.Colors.Wall);
                createdWalls[direction] = wall;
                roomElement.appendChild(wall);
            }
            for (var dir in createdWalls) {
                if (createdWalls[dir] === "") {
                    var wall = createWall(dir, room.Colors.Wall);
                    createdWalls[dir] = wall;
                    roomElement.appendChild(wall);
                }
            }
            return roomElement;
        });
        rooms.forEach(function (room, index, array) {
            var pos = '0 ' + index * 5 + ' 0';
            room.setAttribute('position', pos);
        });
        return rooms;
    };
    return LevelFactory;
}());
exports.LevelFactory = LevelFactory;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utilities = (function () {
    function Utilities() {
    }
    Utilities.getRandomInt = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };
    Utilities.generateGuid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    return Utilities;
}());
exports.Utilities = Utilities;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = __webpack_require__(1);
var LevelFactory_1 = __webpack_require__(0);
var playerName = utilities_1.Utilities.generateGuid();
console.debug(playerName);
var socket = io.connect('http://localhost:3000', { reconnection: false });
AFRAME.registerComponent('open-door', {
    init: function () {
        this.el.addEventListener('click', function (evt) {
            var target = this.getAttribute('target');
            var playerElement = document.getElementById('player');
            socket.emit('player-move', { currentRoom: playerElement.getAttribute('currentroom'), targetRoom: target, player: playerName, doorElementId: this.parentEl.getAttribute('id') });
        });
    }
});
AFRAME.registerComponent('open-inventory-listener', {
    init: function () {
        this.el.addEventListener('click', function (evt) {
            var inventoryElement = document.createElement('a-plane');
            inventoryElement.setAttribute('position', '0 2.6 0');
            inventoryElement.setAttribute('rotation', '90 0 -90');
            inventoryElement.setAttribute('id', 'inventory');
            var exitElement = document.createElement('a-plane');
            exitElement.setAttribute('value', 'X');
            exitElement.setAttribute('position', '0 0.4 0.05');
            exitElement.setAttribute('rotation', '0 0 -90');
            exitElement.setAttribute('scale', '0.2 0.2 1');
            exitElement.setAttribute('color', 'green');
            exitElement.setAttribute('close-inventory-listener', '');
            inventoryElement.appendChild(exitElement);
            var playerElement = document.getElementById('player');
            playerElement.appendChild(inventoryElement);
        });
    }
});
AFRAME.registerComponent('close-inventory-listener', {
    init: function () {
        this.el.addEventListener('click', function (evt) {
            console.log('close inventory');
            var inventoryElement = document.getElementById('inventory');
            inventoryElement.parentNode.removeChild(inventoryElement);
        });
    }
});
AFRAME.registerComponent('game-timer', {
    init: function () {
        var time = 180;
        setInterval(function () {
            time = time - 1;
            var timeElement = document.getElementById('timer');
            timeElement.setAttribute('value', time.toString());
        }, 1000);
    }
});
window.addEventListener("load", function () {
    socket.emit('join', playerName);
    socket.on('joined', function (state) {
        var scene = document.getElementById('scene');
        if (state.playerData.Name !== playerName) {
            var enemyElement = document.createElement('a-entity');
            enemyElement.setAttribute('id', state.playerData.Name);
            var enemyAvatar = document.createElement('a-image');
            enemyAvatar.setAttribute('src', 'spy.jpeg');
            enemyAvatar.setAttribute('side', 'double');
            enemyAvatar.setAttribute('visible', 'true');
            enemyAvatar.setAttribute('position', '0 0 -2');
            enemyElement.appendChild(enemyAvatar);
            var roomElement = document.getElementById(state.playerData.Room);
            enemyElement.setAttribute('position', roomElement.getAttribute('position'));
            scene.appendChild(enemyElement);
        }
        else {
            var rooms = LevelFactory_1.LevelFactory.createRooms(state.template);
            rooms.forEach(function (room) {
                if (room.getAttribute("id") === state.players[playerName].Room) {
                    var playerElement = document.getElementById('player');
                    playerElement.setAttribute('currentroom', room.id);
                    var roomPos = room.components.position.attrValue;
                    playerElement.setAttribute('position', roomPos);
                }
                scene.appendChild(room);
            });
        }
    });
    socket.on('player-moved', function (state) {
        console.log(state);
        if (state.player === playerName) {
            var entity = document.querySelector('[sound]');
            entity.components.sound.playSound();
            setTimeout(function () {
                var target = document.getElementById(state.room);
                var targetPos = target.getAttribute('position');
                var newPos = { x: targetPos.x, y: targetPos.y, z: targetPos.z };
                var playerElement = document.getElementById('player');
                var moveAnimation = document.createElement('a-animation');
                moveAnimation.setAttribute('attribute', 'position');
                moveAnimation.setAttribute('dur', '2500');
                moveAnimation.setAttribute('fill', 'forwards');
                var targetDoor = document.getElementById(state.doorElementId);
                var doorPosition = targetDoor.parentEl.getAttribute('position');
                if (doorPosition.x > 0)
                    doorPosition.x = doorPosition.x - 0.20;
                if (doorPosition.z > 0)
                    doorPosition.z = doorPosition.z - 0.20;
                var animationEndPosition = doorPosition.x + ' ' + playerElement.getAttribute('position').y + ' ' + doorPosition.z;
                moveAnimation.setAttribute('to', animationEndPosition);
                playerElement.appendChild(moveAnimation);
                setTimeout(function () {
                    playerElement.setAttribute('position', newPos);
                    var number = utilities_1.Utilities.getRandomInt(0, 20);
                    if (number === 19) {
                        var samara = document.createElement('a-entity');
                        samara.setAttribute('id', 'samara');
                        samara.setAttribute('position', '3 3.5 3');
                        var avatar = document.createElement('a-image');
                        avatar.setAttribute('src', 'lol.png');
                        avatar.setAttribute('position', '0 0 0');
                        var sound = document.createElement('a-sound');
                        sound.setAttribute('src', 'lol.mp3');
                        sound.setAttribute('autoplay', 'true');
                        sound.setAttribute('loop', 'infinite');
                        var animation = document.createElement('a-animation');
                        animation.setAttribute('attribute', 'position');
                        animation.setAttribute('dur', '10000');
                        animation.setAttribute('fill', 'forwards');
                        animation.setAttribute('to', '0 3.5 0');
                        samara.appendChild(avatar);
                        samara.appendChild(sound);
                        samara.appendChild(animation);
                        var player = document.getElementById('player');
                        player.appendChild(samara);
                    }
                }, 2550);
            }, 1200);
        }
        else {
            var enemyElement = document.getElementById(state.player);
            var roomElement = document.getElementById(state.room);
            enemyElement.setAttribute('position', roomElement.getAttribute('position'));
        }
    });
});


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map