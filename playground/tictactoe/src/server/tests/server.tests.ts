import { GameSession, GameStatus } from '../gameSession';
import { Player } from '../player';
import { expect } from 'chai';
import 'mocha';


describe('GameSession', () => {
  describe('When player joins', () => {
    it('should set state of gameSession to in progress', () => {

      const player1 = new Player('1', 'Cross');
      const player2 = new Player('1', 'Circle');

      const session = new GameSession(player1);
      session.addPlayer(player2);

      expect(session.status.valueOf()).to.be.equal(GameStatus.InProgress.valueOf());
    });
  });
});

describe('Victory conditions', () => {
  describe('When player gets one row of markers', () => {
    it('should set state of gameSession to finished and set correct winner', () => {

      const player1 = new Player('player1', 'Cross');
      const player2 = new Player('player2', 'Circle');

      const session = new GameSession(player1);
      session.addPlayer(player2);

      session.placeMarker(player1.id, "1");
      session.placeMarker(player2.id, "4");
      session.placeMarker(player1.id, "2");
      session.placeMarker(player2.id, "5");
      session.placeMarker(player1.id, "3");

      console.log(session.status)

      expect(session.status.valueOf()).to.be.equal(GameStatus.Finished.valueOf());
      expect(session.board.winner).to.be.equal(player1.id);
    });
  });
  describe('When player gets one column of markers', () => {
    it('should set state of gameSession to finished and set correct winner', () => {

      const player1 = new Player('player1', 'Cross');
      const player2 = new Player('player2', 'Circle');

      const session = new GameSession(player1);
      session.addPlayer(player2);

      session.placeMarker(player1.id, "1");
      session.placeMarker(player2.id, "2");
      session.placeMarker(player1.id, "4");
      session.placeMarker(player2.id, "3");
      session.placeMarker(player1.id, "7");

      console.log(session.status)

      expect(session.status.valueOf()).to.be.equal(GameStatus.Finished.valueOf());
      expect(session.board.winner).to.be.equal(player1.id);
    });
  });
  describe('When player gets one diagonal of markers', () => {
    it('should set state of gameSession to finished and set correct winner', () => {

      const player1 = new Player('player1', 'Cross');
      const player2 = new Player('player2', 'Circle');

      const session = new GameSession(player1);
      session.addPlayer(player2);

      session.placeMarker(player1.id, "1");
      session.placeMarker(player2.id, "2");
      session.placeMarker(player1.id, "5");
      session.placeMarker(player2.id, "3");
      session.placeMarker(player1.id, "9");

      console.log(session.status);

      expect(session.status.valueOf()).to.be.equal(GameStatus.Finished.valueOf());
      expect(session.board.winner).to.be.equal(player1.id);
    });
  });
  describe('When there is a draw', () => {
    it('should set state of gameSession to draw and set winner to null', () => {

      const player1 = new Player('player1', 'Cross');
      const player2 = new Player('player2', 'Circle');

      const session = new GameSession(player1);
      session.addPlayer(player2);

      session.placeMarker(player1.id, "2"); // 1
      session.placeMarker(player2.id, "1"); // 2
      session.placeMarker(player1.id, "3"); // 3
      session.placeMarker(player2.id, "6"); // 4
      session.placeMarker(player1.id, "5"); // 5
      session.placeMarker(player2.id, "8"); // 6 
      session.placeMarker(player1.id, "4"); // 7
      session.placeMarker(player2.id, "7"); // 8
      session.placeMarker(player1.id, "9"); // 9

      console.log(session.status);
      console.log(session.status);

      expect(session.status.valueOf()).to.be.equal(GameStatus.Draw.valueOf());
      expect(session.board.winner).to.be.equal(null);
    });
  });
}); 