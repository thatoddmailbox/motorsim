import {
	AmbientLight,
	BoxBufferGeometry,
	CameraHelper,
	DirectionalLight,
	DirectionalLightHelper,
	Mesh,
	MeshBasicMaterial,
	Scene,
	PCFSoftShadowMap,
	PerspectiveCamera,
	WebGLRenderer,
	Vector3,
	MeshLambertMaterial
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { COLOR_PLATFORM, COLOR_WHITE } from "consts.ts";

import Motor from "Motor.ts";

export default class App {
	renderer: WebGLRenderer;

	scene: Scene;
	camera: PerspectiveCamera;
	controls: OrbitControls;

	light: DirectionalLight;

	motor: Motor;

	constructor(canvas: HTMLCanvasElement) {
		var canvasWidth = canvas.width;
		var canvasHeight = canvas.height;
		
		this.scene = new Scene();
		this.camera = new PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 1000);
		
		this.renderer = new WebGLRenderer({
			canvas: canvas,
			antialias: true
		});
		// this.renderer.shadowMap.enabled = true;
		// this.renderer.shadowMap.type = PCFSoftShadowMap;

		// camera controls
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		
		// light
		this.light = new DirectionalLight(COLOR_WHITE, 1);
		this.light.position.set(5, 5, 10);
		this.light.target.position.set(0, 2, 0);
		this.light.castShadow = true;
		this.scene.add(this.light);

		// this.light.shadow.mapSize.width = 512;
		// this.light.shadow.mapSize.height = 512;
		// this.light.shadow.camera.near = 0.5;
		// this.light.shadow.camera.far = 500;

		// light helper
		// var lightHelper = new DirectionalLightHelper(this.light, 5);
		// this.scene.add(lightHelper);

		// camera helper
		// var cameraHelper = new CameraHelper(this.light.shadow.camera);
		// this.scene.add(cameraHelper);

		// base platform
		var geometry = new BoxBufferGeometry(15, 0.5, 7.5);
		var material = new MeshLambertMaterial({ color: COLOR_PLATFORM });
		var platform = new Mesh(geometry, material);
		platform.receiveShadow = true;
		this.scene.add(platform);

		this.motor = new Motor(new Vector3(0, 0, 0), this.scene);

		// move camera back
		this.camera.position.x = 5;
		this.camera.position.y = 7;
		this.camera.position.z = 17.5;
		this.camera.lookAt(0, 2, 0);
		this.controls.update();
		// this.camera.rotation.x = -2*(Math.PI/180);
	}

	update() {
		this.motor.update();

		this.controls.update();
	}

	draw() {
		this.renderer.render(this.scene, this.camera);
		// this.camera.position.y += 0.001;
	}
};