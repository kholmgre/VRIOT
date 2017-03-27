import { ItemDescription } from '../shared/itemDescription';
import { Position } from '../shared/position';

const eastPosition = new Position(-4, -1.8, 0);
const southPosition = new Position(0, -1.8, -4);
const northPosition = new Position(0, -1.8, 4);
const westPosition = new Position(4, -1.8, 0);

const northPos = new ItemDescription("a-text", { "value": "N", "color": "red", "rotation": "-90 0 0" }, northPosition);
const southPos = new ItemDescription("a-text", { "value": "S", "color": "red", "rotation": "-90 0 0" }, southPosition);
const eastPos = new ItemDescription("a-text", { "value": "E", "color": "red", "rotation": "-90 0 0" }, eastPosition);
const westPos = new ItemDescription("a-text", { "value": "W", "color": "red", "rotation": "-90 0 0" }, westPosition);

export const allDirections = [northPos, southPos, eastPos, westPos];