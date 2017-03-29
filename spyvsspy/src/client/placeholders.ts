import { LevelFinished } from '../events/events';
import { Player } from '../shared/player';

export module Placeholders {
    export function LobbyWaiting() : HTMLElement {
        const waiting = document.createElement('a-plane');
        waiting.setAttribute('color', 'black');
        waiting.setAttribute('id', 'waitingPlane');
        waiting.setAttribute('position', '0 0 -1');
        waiting.setAttribute('width', '5');
        waiting.setAttribute('height', '5');

        const text = document.createElement('a-text');
        text.setAttribute('value', 'Waiting for players..');
        text.setAttribute('color', 'green');
        text.setAttribute('position', '-0.95 0 0.45');

        waiting.appendChild(text);

        return waiting;
    }
    export function RemoveLobby() : void {
        const element = document.getElementById('waitingPlane');
        element.parentElement.removeChild(element);
    }
    export function Score(event: LevelFinished) : HTMLElement {
        const score = document.createElement('a-plane');
        score.setAttribute('color', 'black');
        score.setAttribute('position', '0 0 -1');
        score.setAttribute('width', '5');
        score.setAttribute('height', '5');

        const text = document.createElement('a-text');

        let formattedText = 'Total score: ' + event.totalScore;

        event.players.forEach((p: Player) => formattedText += '\n' + p.name + ':' + p.score);

        text.setAttribute('value', formattedText);
        text.setAttribute('color', 'green');
        text.setAttribute('position', '-0.95 0 0.45');

        score.appendChild(text);

        return score;
    }
}