import * as TWEEN from '@tweenjs/tween.js/dist/tween.umd';
import { Color, DirectionalLight, Group, HemisphereLight, Scene, AmbientLight, DirectionalLightHelper } from 'three';
import Box from '../objects/Box';
import BoxCreator from '../objects/BoxCreator';
import SlicesBox from '../objects/SlicesBox';
import UserInterface from '../objects/UserInterface';
import Observer, { EVENTS } from '../Observer';

class Scene1 extends Scene {
	constructor() {
		super();
		new UserInterface();
		this.background = new Color('#fcbf49').convertSRGBToLinear();
		this.stackPoints = 0;
		this.gameOver = true;
		this.create();
		this.events();
	}

	create() {
		this.baseCube = new BoxCreator({
			width: 200,
			height: 200,
			alt: 200,
			color: 0x2c3e50
		});
		this.add(this.baseCube);

		// Boxes Group
		this.boxesGroup = new Group();
		this.add(this.boxesGroup);

		// Lights
		const ambientLight = new HemisphereLight(0xffffbb, 0x080820, .5);
		const light = new DirectionalLight(0xffffff, 1.0);
		const directionalLight = new DirectionalLight(0xffffff, 1);
		directionalLight.position.set(2, 1, 5);
		this.add(directionalLight);
		this.add(light, ambientLight);
	}

	newBox({ width, height, last }) {
		const newBox = new Box({
			width,
			height,
			last
		});
		this.boxesGroup.add(newBox);
	}

	getLastBox() {
		return this.boxesGroup.children[this.boxesGroup.children.length - 1];
	}

	events() {
		Observer.emit(EVENTS.newGame);

		Observer.on(EVENTS.click, () => {
			if (this.gameOver) {
				Observer.emit(EVENTS.start);
				return;
			}
			this.getLastBox().place();
		});

		Observer.on(EVENTS.start, () => {
			this.resetGroup();
			Observer.emit(EVENTS.updatePoints, this.stackPoints);
			this.newBox({
				width: 200,
				height: 200,
				last: this.baseCube
			});
			this.gameOver = false;
		});

		Observer.on(EVENTS.stack, (newBox) => {
			this.stackPoints++;
			Observer.emit(EVENTS.updatePoints, this.stackPoints);

			//Remove the main block
			this.boxesGroup.remove(this.getLastBox());

			//Space to cut block
			const currentBaseCut = new SlicesBox(newBox);
			this.boxesGroup.add(currentBaseCut.getBase());
			this.add(currentBaseCut.getCut());

			//EFFECT CUT BLOCK
			const tweenCut = new TWEEN.Tween(currentBaseCut.getCut().position)
				.to({
					[newBox.axis]: currentBaseCut.getCut().position[newBox.axis] + (200 * newBox.direction)
				}, 500)
				.easing(TWEEN.Easing.Quadratic.Out);
			tweenCut.start();
			currentBaseCut.getCut().material.transparent = true;
			const tweenCutAlpha = new TWEEN.Tween(currentBaseCut.getCut().material)
				.to({
					opacity: 0
				}, 600)
				.easing(TWEEN.Easing.Quadratic.Out)
				.onComplete(() => {
					this.remove(currentBaseCut.getCut());
				});
			tweenCutAlpha.start();

			// New block
			this.newBox({
				width: newBox.base.width,
				height: newBox.base.height,
				last: this.getLastBox()
			});

		});

		Observer.on(EVENTS.gameover, () => {
			if (!this.gameOver) {
				this.stackPoints = 0;
				const tweenGameOver = new TWEEN.Tween(this.getLastBox().position)
					.to({
						y: this.getLastBox().position.y + 300
					}, 1000)
					.easing(TWEEN.Easing.Bounce.Out);
				tweenGameOver.start();
			}
			this.gameOver = true;
		});
	}

	resetGroup() {
		this.boxesGroup.children.map((box, i) => {
			const tweenDestroy = new TWEEN.Tween(box.scale)
				.to({
					x: .5,
					y: .5,
					z: .5
				}, 80 * i)
				.easing(TWEEN.Easing.Quadratic.Out)
				.onComplete(() => {
					this.boxesGroup.remove(box);
				});
			tweenDestroy.start();
		});
	}

	update() {
		TWEEN.update();
		if (!this.gameOver) {
			this.getLastBox().update();
		}
	}

}

export default Scene1;
