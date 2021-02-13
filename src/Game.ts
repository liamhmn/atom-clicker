import { BigFloat } from 'bigfloat.js';
import * as PIXI from 'pixi.js';
import { app } from './app.js';
import Clickable from './Clickable.js';
import Upgrade from './Upgrade.js';
import { sleep } from './utils/utils.js';

export default class Game {
	public mainAtom: Clickable;
	public showedCount: PIXI.Text;
	public atomsCount: BigFloat = new BigFloat(0);
	public atomPerSeconds: BigFloat = new BigFloat(0);
	public showedAPS: PIXI.Text;
	public upgrades: Upgrade[] = [];

	public constructor() {
		this.mainAtom = new Clickable(PIXI.Texture.WHITE);
		this.mainAtom.sprite.height = 400;
		this.mainAtom.sprite.width = 400;
		this.mainAtom.sprite.position.set(window.innerWidth / 2 - this.mainAtom.sprite.width / 2, 150);
		app.stage.addChild(this.mainAtom.sprite);

		const style = new PIXI.TextStyle({
			dropShadow: true,
			dropShadowBlur: 5,
			dropShadowDistance: 0,
			fill: '#ffffff',
			fontSize: 50,
			padding: 20,
		});
		this.showedCount = new PIXI.Text(this.atomsCount.toString(), style);
		this.showedCount.anchor.set(0.5);
		this.showedCount.position.set(window.innerWidth / 2, 40);
		app.stage.addChild(this.showedCount);

		this.showedAPS = new PIXI.Text(this.atomPerSeconds.toString(), JSON.parse(JSON.stringify(style)));
		this.showedAPS.style.fontSize = 30;
		this.showedAPS.anchor.set(0.5);
		this.showedAPS.position.set(window.innerWidth / 2, 80);
		app.stage.addChild(this.showedAPS);

		this.mainAtom.on('click', () => {
			this.atomsCount = this.atomsCount.add(1);
		});
		
		this.upgrades.push(new Upgrade({
			name: 'quarks',
			atomsPerSecond: 0.1,
			startingPrice: 10
		}));
		
		this.upgrades.push(new Upgrade({
			name: 'nucleons',
			atomsPerSecond: 3,
			startingPrice: 100
		}));
		
		this.upgrades.push(new Upgrade({
			name: 'white hole',
			atomsPerSecond: 50,
			startingPrice: 5000
		}));
	}

	public update() {
		this.showedCount.text = `${this.atomsCount.toString().split('.')[0]} atoms`;
		this.showedCount.position.x = window.innerWidth / 2;
		this.showedAPS.text = `per second: ${this.atomPerSeconds.toString().replace(/(\d+\.\d{2})\d+/g, '$1')}`;
		this.showedAPS.position.x = window.innerWidth / 2;
		this.mainAtom.sprite.position.x = window.innerWidth / 2 - this.mainAtom.sprite.width / 2;
		
		this.upgrades.forEach(upgrade => upgrade.update());
		this.upgrades.forEach((upgrade, index) => {
			upgrade.container.x = window.innerWidth - upgrade.container.width;
			upgrade.container.y = index * upgrade.container.height;
			app.stage.addChild(upgrade.container);
		})
	}

	public async calculateAPS() {
		const oldAtoms = this.atomsCount;
		await sleep(1000);
		this.atomPerSeconds = this.atomsCount.sub(oldAtoms);
	}
}
