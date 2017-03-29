// import { Room } from '../shared/rooms';
// import { Player } from '../shared/player';
// import { Utilities } from '../shared/utilities';
// import { Position } from '../shared/position';
// import { LevelTemplate } from '../levels/levelLibrary';

// export class GameState {
//     players: Player[];
//     map: LevelTemplate;
//     timeRemaining: number;
//     id: string;

//     constructor(template: LevelTemplate) {
//         this.map = template;
//         this.timeRemaining = 360;
//         this.id = Utilities.generateGuid();
//         this.players = [];
//     }

//     private getPositionForNewPlayer(player: Player): Position {
//         const room = Utilities.getRandomInt(0, this.map.rooms.length - 1);

//         return new Position(Utilities.getRandomInt(0, 1), -3, Utilities.getRandomInt(0, 1));
//     }

//     addPlayer(player: Player): void {
//         if (this.players.find((p: Player) => { return p.id === player.id }) !== undefined)
//             return;
        
//         let pos = this.getPositionForNewPlayer(player);
//         player.position = pos;
//         this.players.push(player);
//     }

//     removePlayer(playerId: string) {
//         throw 'Not implemented';
//     }
// }