import { Client } from '../client/client';
import { MarkerPlaced } from '../shared/markerPlaced';

const client = new Client(null, true);

client.currentGame = {"players":[{"id":"tVBbgFapmPseBsBlAAAF","name":"Cross"}],"id":"5ffefe08-b283-083b-e589-6ae6f6322af3","status":0,"board":{"boxes":{"1":{"checked":false},"2":{"checked":false},"3":{"checked":false},"4":{"checked":false},"5":{"checked":false},"6":{"checked":false},"7":{"checked":false},"8":{"checked":false},"9":{"checked":false}}}};
client.currentTurnPlayerId = "1";

// client.createBoard();
// client.gameUpdate(new MarkerPlaced('Cross', '1', '1'));

// client.createMenu();    
client.createGameOver('skull', 'lol');
// client.createGameOver('trophy', 'You won!');