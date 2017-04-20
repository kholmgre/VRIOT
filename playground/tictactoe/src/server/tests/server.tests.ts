import { GameSession, GameStatus } from '../gameSession';
import { Player } from '../player';
import { expect } from 'chai';
import 'mocha';


describe('GameSession', () => {
  describe('Victory condition', () => {
    it('should set state of gameSession to finished', () => {

      const player1 = new Player('1', 'Cross');
      const player2 = new Player('1', 'Circle');

      const session = new GameSession(player1);
      session.addPlayer(player2);

      console.log(JSON.stringify(session));

      expect(session.status.valueOf()).to.be.equal(GameStatus.InProgress.valueOf());
    });
  });
}); 