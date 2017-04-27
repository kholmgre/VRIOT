import { GameSession } from './gameSession';
export declare module EventHandlers {
    function createGame(playerId: string, gameSessions: Array<GameSession>, socket: any): GameSession;
    function joinGame(playerId: string, gameSession: GameSession, socket: any, io: any): void;
}
