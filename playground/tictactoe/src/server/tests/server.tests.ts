import { GameSession, GameStatus } from '../gameSession';
import { Player } from '../player';
import { expect } from 'chai';
import 'mocha';

describe('Creating a game', () => {
  describe('When a game has two players', () => {
    it('should set state of gameSession to in progress', () => {

      const player1 = new Player('1', 'Cross');
      const player2 = new Player('2', 'Circle');

      const session = new GameSession(player1);
      session.addPlayer(player2);

      expect(session.status.valueOf()).to.be.equal(GameStatus.InProgress.valueOf());
    });
  });
  describe('When a game has one player', () => {
    it('should set state of gameSession to lobby', () => {

      const player1 = new Player('1', 'Cross');

      const session = new GameSession(player1);

      expect(session.status.valueOf()).to.be.equal(GameStatus.Lobby.valueOf());
    });
  });
});

describe('Placing a marker', () => {
  describe('When placing a marker if it is not that players turn', () => {
    it('should not set marker', () => {

      const player1 = new Player('1', 'Cross');
      const player2 = new Player('2', 'Circle');

      const session = new GameSession(player1);
      session.addPlayer(player2);

      session.placeMarker(player2.id, "1");

      expect(session.board.boxes["1"].checked).to.be.equal(false);
    });
  });
  describe('When placing a marker', () => {
    it('should set marker as placed on box and by correct player', () => {

      const player1 = new Player('1', 'Cross');
      const player2 = new Player('2', 'Circle');

      const session = new GameSession(player1);
      session.addPlayer(player2);

      session.placeMarker(player1.id, "1");

      expect(session.board.boxes["1"].checked).to.be.equal(true);
      expect(session.board.boxes["1"].byPlayer).to.be.equal(player1.id);
    });
    it('should not be able to set on board-unit where marker already exists', () => {

      const player1 = new Player('1', 'Cross');
      const player2 = new Player('2', 'Circle');

      const session = new GameSession(player1);
      session.addPlayer(player2);

      session.placeMarker(player1.id, "1");
      session.placeMarker(player2.id, "1");

      expect(session.board.boxes["1"].checked).to.be.equal(true);
      expect(session.board.boxes["1"].byPlayer).to.be.equal(player1.id);
    });
    it('should set currentTurnPlayer to other player', () => {

      const player1 = new Player('1', 'Cross');
      const player2 = new Player('2', 'Circle');

      const session = new GameSession(player1);
      session.addPlayer(player2);

      session.placeMarker(player1.id, "1");
      expect(session.playerCurrentTurn.id).to.be.equal(player2.id);
      session.placeMarker(player2.id, "2");
      expect(session.playerCurrentTurn.id).to.be.equal(player1.id);
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

      expect(session.status.valueOf()).to.be.equal(GameStatus.Finished.valueOf());
      expect(session.board.winner).to.be.equal(player1.id);

      const session2 = new GameSession(player1);
      session2.addPlayer(player2);

      session2.placeMarker(player1.id, "3");
      session2.placeMarker(player2.id, "2");
      session2.placeMarker(player1.id, "5");
      session2.placeMarker(player2.id, "6");
      session2.placeMarker(player1.id, "7");

      expect(session2.status.valueOf()).to.be.equal(GameStatus.Finished.valueOf());
      expect(session2.board.winner).to.be.equal(player1.id);
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

      expect(session.status.valueOf()).to.be.equal(GameStatus.Draw.valueOf());
      expect(session.board.winner).to.be.equal(null);
    });
  });
}); 