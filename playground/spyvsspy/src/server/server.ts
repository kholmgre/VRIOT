import { Player } from '../shared/player';
import { JoinCampaignCommand, OpenDoorCommand, PlayerMoveCommand, StartCampaignCommand, ChangeNameCommand, PlayLevelCommand } from '../commands/commands';
import { DoorOpened, PlayerChangedRoom, JoinedCampaign, PlayerJoined, PlayerMoved, PlayerLeft, LevelFinished } from '../events/events';
import { Room } from '../shared/rooms';
import { campaigns } from '../campaigns/campaignLibrary';
import { CampaignTemplate, Campaign, CampaignState } from '../campaigns/campaign';
import { Connected } from '../shared/connected';

const express = require('express');
const app = express();
const server = app.listen('3000');

const io = require('socket.io').listen(server);
io.set('origins', '*:*');

const currentCampaigns: Campaign[] = [];

function findDirection(room: Room, target: string): string {
	let direction = '';

	const directions = ['E', 'S', 'W', 'N'];

	directions.forEach((d: string) => {
		if (room.doors[d] !== null && room.doors[d] !== undefined) {
			if (room.doors[d].targetRoom === target) {
				direction = d;
			}
		}
	});

	return direction;
}

function getJoinableCampaigns(): Array<Campaign> {
	return currentCampaigns.filter((c: Campaign) => c.state === CampaignState.Lobby);
}

io.on('connection', function (socket: any) {

	// Mutable "session" data
	const playerId = socket.id;
	let playername = 'unkown';
	let currentCampaign: Campaign = null

	console.log('player joined! ' + playerId);

	socket.emit('connected-to-server', new Connected(campaigns, getJoinableCampaigns(), playername, playerId));

	socket.on('change-name', function (command: ChangeNameCommand) {
		playername = command.name;
	});

	socket.on('start-campaign', function (command: StartCampaignCommand) {

		const campaignTemplate = campaigns.find((m: CampaignTemplate) => m.name === command.campaignName);

		if (campaignTemplate === undefined)
			return;

		const newCampaign = new Campaign(campaignTemplate);

		currentCampaigns.push(newCampaign);

		const newPlayer = new Player(playerId, playername);

		newCampaign.addPlayer(newPlayer);

		currentCampaign = newCampaign;

		socket.emit('lobby-wait');
	});

	socket.on('join-game', function (command: JoinCampaignCommand) {

		const campaignToJoin = currentCampaigns.find((c: Campaign) => c.id === command.campaignId);

		if (campaignToJoin === undefined)
			return;

		currentCampaign = campaignToJoin;

		if (currentCampaign.players.find((p: Player) => p.id === playerId) !== undefined)
			return;

		const newPlayer = new Player(playerId, playername);

		currentCampaign.addPlayer(newPlayer);

		if (currentCampaign.state === CampaignState.PlayLevel) {
			const firstLevel = currentCampaign.start();
			const playLevelCommand = new PlayLevelCommand(firstLevel, currentCampaign.players);

			socket.broadcast.emit('start-level', playLevelCommand);
			socket.emit('start-level', playLevelCommand);
		} else {
			socket.emit('lobby-wait');
		}

		console.log('player ' + playerId + ' joined game ' + campaignToJoin.id + '. ' + campaignToJoin.players.length + '/' + campaignToJoin.campaign.maxPlayers + ' players');
	});

	socket.on('level-finished', function (event: LevelFinished) {
		const result = currentCampaign.finishLevel();

		socket.broadcast.emit('show-score', result);

		setTimeout(function () {
			const nextMap = currentCampaign.nextMap();

			socket.broadcast.emit('start-level', nextMap);
		}, 10000);
	});

	socket.on('player-move-command', function (command: PlayerMoveCommand) {

		// Todo verify legal
		// Player moved between rooms

		const player = currentCampaign.players.find((p: Player) => p.id === playerId);

		player.position = command.desiredPosition;

		const playerMovedEvent = new PlayerMoved();

		playerMovedEvent.currentPosition = command.currentPosition;
		playerMovedEvent.desiredPosition = command.desiredPosition;
		playerMovedEvent.playerId = playerId;

		io.sockets.emit('player-move', playerMovedEvent);
	});

	socket.on('open-door-command', function (command: OpenDoorCommand) {

		console.log('received open-door-command ' + JSON.stringify(command));

		const currentRoom = currentCampaign.campaign.levels[currentCampaign.currentMapIndex].rooms.find((r: Room) => { return r.id === command.sourceRoom });
		const targetRoom = currentCampaign.campaign.levels[currentCampaign.currentMapIndex].rooms.find((r: Room) => { return r.id === command.targetRoom });

		const fromDirection = findDirection(currentRoom, command.targetRoom);

		const toDirection = findDirection(targetRoom, command.sourceRoom);

		if (toDirection === '') {
			console.log('toDirection was null\n' + JSON.stringify(command));
		}

		// Refactor

		let emitDoorOpenEvent: boolean;

		switch (fromDirection) {
			case 'E':
				if (currentRoom.doors.E.open !== true) {
					currentRoom.doors.E.open = true;
					targetRoom.doors.W.open = true;
					emitDoorOpenEvent = true;
				}
				break;
			case 'W':
				if (currentRoom.doors.W.open !== true) {
					currentRoom.doors.W.open = true;
					targetRoom.doors.E.open = true;
					emitDoorOpenEvent = true;
				}
				break;
			case 'N':
				if (currentRoom.doors.N.open !== true) {
					currentRoom.doors.N.open = true;
					targetRoom.doors.S.open = true;
					emitDoorOpenEvent = true;
				}
				break;
			case 'S':
				if (currentRoom.doors.S.open !== true) {
					currentRoom.doors.S.open = true;
					targetRoom.doors.N.open = true;
					emitDoorOpenEvent = true;
				}
				break;
			default:
				break;
		}

		if (emitDoorOpenEvent === true) {
			console.log('emitting door opened event');
			// TODO: update game state with door state, so joining players will see opened doors
			const doorOpenedEvent = new DoorOpened(currentRoom.id, targetRoom.id, playerId);
			io.sockets.emit('door-opened', doorOpenedEvent)
		}

		const event = new PlayerMoved();
		event.desiredPosition = currentRoom.doors[fromDirection].targetPosition;
		event.playerId = playerId;
		event.throughDoor = true;

		if (event.throughDoor === true) {
			event.targetRoom = command.targetRoom;
			event.room = command.sourceRoom;
			event.direction = fromDirection;
		}

		io.sockets.emit('player-move', event);
	});

	socket.on('disconnect', function () {

		if (currentCampaign === null)
			return;

		const playerIndex = currentCampaign.players.findIndex((p: Player) => { return p.id === socket.id });
		currentCampaign.players.splice(playerIndex, 1);

		if (currentCampaign.players.length === 0) {
			console.log('No more players in game ' + currentCampaign.id + ' deleting it');
			const index = currentCampaigns.findIndex((c: Campaign) => { return currentCampaign.id === c.id });

			if (index !== -1) {
				currentCampaigns.splice(index, 1);
			}
		} else {
			console.log(playerId + ' left');
			socket.broadcast.emit('player-left', new PlayerLeft(currentCampaign.id, playerId));
		}

	});
});