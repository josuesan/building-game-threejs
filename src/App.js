import * as TWEEN from '@tweenjs/tween.js/dist/tween.umd';
import { OrthographicCamera, sRGBEncoding, WebGLRenderer } from 'three';
import Observer, { EVENTS } from './Observer';
import Scene1 from './scenes/Scene1';

export class App {
	constructor(container) {
		this.container = container;

		this.cameraPanUp = 40;
		this.cameraY = 200;

		this.scene = new Scene1();

		// Camera's config
		this.camera = new OrthographicCamera(
			this.container.clientWidth / -2,
			this.container.clientWidth / 2,
			this.container.clientHeight / 2,
			this.container.clientHeight / -2,
			-1000,
			1000
		);
		this.camera.position.set(10, 10 + this.cameraY, 10);
		this.camera.lookAt(0, this.cameraY, 0);

		// Renderer's config
		this.renderer = new WebGLRenderer({
			antialias: true,
		})
		this.renderer.setPixelRatio(window.devicePixelRatio);

		// sRGBEncoding
		this.renderer.outputEncoding = sRGBEncoding;

		// Light's config
		this.renderer.physicallyCorrectLights = true;

		this.container.appendChild(this.renderer.domElement);
		this.onResize();
		this.render();
		this.events();
	}

	onResize() {
		this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
		this.camera.left = this.container.clientWidth / -2;
		this.camera.right = this.container.clientWidth / 2;
		this.camera.top = this.container.clientHeight / 2;
		this.camera.bottom = this.container.clientHeight / -2;
		this.camera.updateProjectionMatrix();
	}

	events() {
		Observer.on(EVENTS.stack, () => {
			this.cameraY += this.cameraPanUp;
			const cameraUp = new TWEEN.Tween(this.camera.position)
				.to({
					y: 10 + this.cameraY
				}, 500)
				.easing(TWEEN.Easing.Sinusoidal.In);
			cameraUp.start();
		});

		Observer.on(EVENTS.start, () => {
			this.cameraY = 200;
			this.camera.position.set(10, 10 + this.cameraY, 10);
			this.camera.lookAt(0, this.cameraY, 0);

			const cameraZoomIn = new TWEEN.Tween(this.camera)
				.to({
					zoom: 1
				}, 800)
				.easing(TWEEN.Easing.Sinusoidal.In)
				.onUpdate(() => {
					this.camera.updateProjectionMatrix();
				})
			cameraZoomIn.start();
		});

		Observer.on(EVENTS.gameover, () => {
			const cameraZoomOut = new TWEEN.Tween(this.camera)
				.to({
					zoom: .6
				}, 700)
				.easing(TWEEN.Easing.Quadratic.Out)
				.onUpdate(() => {
					this.camera.updateProjectionMatrix();
				})
			cameraZoomOut.start();
		});

	}

	render() {
		this.renderer.render(this.scene, this.camera);
		this.scene.update();
		this.renderer.setAnimationLoop(() => this.render());
	}
}
