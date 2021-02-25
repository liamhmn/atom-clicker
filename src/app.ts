import {BigFloat} from 'bigfloat.js';
import * as PIXI from 'pixi.js';
import Game from './app/Game';
import {JSONObject} from './types';

export let game: Game;

async function setup() {
	await loadTextures();
	game = new Game();
	(window as any).game = game;
}

export function loadGameFromSave(save: JSONObject) {
	app.stage.removeChildren();
	game = new Game(save);
	(window as any).game = game;
}

export const app = new PIXI.Application({
	antialias: true,
	resizeTo: window,
	backgroundColor: 0xaaaaaa,
});

async function loadTextures() {
	await new Promise(resolve => {
		PIXI.Loader.shared.add('x', 'textures/x.png');
		PIXI.Loader.shared.load(resolve);
	});
}

setup().then(() => {
	PIXI.Ticker.shared.add(async () => game.update(), {}, PIXI.UPDATE_PRIORITY.HIGH);
	console.log('Game started.');
});

document.body.appendChild(app.view);

(window as any).bigfloat = BigFloat;
(window as any).app = app;
(window as any).PIXI = PIXI;
