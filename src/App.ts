import {
	AmbientLight,
	BoxBufferGeometry,
	CameraHelper,
	Clock,
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
import MotorParameters from "MotorParameters.ts";
import Resources from "Resources.ts";

export default class App {
	renderer: WebGLRenderer;
	clock: Clock;

	scene: Scene;
	camera: PerspectiveCamera;
	controls: OrbitControls;

	light: DirectionalLight;

	motor: Motor;

	parameters: MotorParameters;

	constructor(canvas: HTMLCanvasElement) {
		Resources.init();

		this.clock = new Clock();

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

		this.parameters = {
			batteryVoltage: 10,
			armatureMass: 0.1,
			armatureLength: 1/12,
			armatureResistance: 100,
			statorFieldStrength: 0.001,

			dataCallback: null
		};
		this.motor = new Motor(this.parameters, new Vector3(0, 0.25, 0), this.scene);

		// move camera back
		this.camera.position.x = 5;
		this.camera.position.y = 7;
		this.camera.position.z = 17.5;
		this.camera.lookAt(0, 2, 0);
		this.controls.update();
		// this.camera.rotation.x = -2*(Math.PI/180);

		// create control panel
		var controlPanel = document.getElementById("controlPanel") as HTMLDivElement;
		var displayParameters = {
			batteryVoltage: {
				name: "Battery voltage",
				unit: "V",
				min: 1,
				max: 100,
				step: 1
			},
			armatureMass: {
				name: "Armature mass",
				unit: "kg",
				min: 0.1,
				max: 10,
				step: 0.1
			},
			// armatureLength: {
			// 	name: "Armature length",
			// 	unit: "m",
			// 	min: 0.01,
			// 	max: 1,
			// 	step: 0.1
			// },
			armatureResistance: {
				name: "Armature resistance",
				unit: "\u2126",
				min: 1,
				max: 1000,
				step: 1
			},
			statorFieldStrength: {
				name: "Stator field strength",
				unit: "T",
				min: 0.0001,
				max: 0.25,
				step: 0.0001
			}
		};

		var sliderChangeCallback = function(parameterKey: string, parameterDisplayNumber: HTMLDivElement, e: InputEvent) {
			var displayParameter = displayParameters[parameterKey];
			var newValue = parseFloat((e.target as HTMLInputElement).value);

			if (newValue < displayParameter.min) {
				newValue = displayParameter.min;
			}
			if (newValue > displayParameter.max) {
				newValue = displayParameter.max;
			}

			this.parameters[parameterKey] = newValue;
			parameterDisplayNumber.textContent = newValue.toString();
			// console.log(parameterKey, this.parameters[parameterKey]);
		};

		for (var parameterKey in displayParameters) {
			var displayParameter = displayParameters[parameterKey];

			var parameterElement = document.createElement("div");
			parameterElement.className = "parameter";

			var parameterName = document.createElement("div");
			parameterName.className = "parameterName";
			parameterName.textContent = displayParameter.name;
			parameterElement.appendChild(parameterName);

			var parameterDisplay = document.createElement("div");

			var parameterDisplayNumber = document.createElement("span");
			parameterDisplayNumber.textContent = this.parameters[parameterKey].toString();
			parameterElement.appendChild(parameterDisplayNumber);
			var parameterDisplayUnits = document.createElement("span");
			parameterDisplayUnits.textContent = " " + displayParameter.unit;
			parameterElement.appendChild(parameterDisplayUnits);

			parameterElement.appendChild(parameterDisplay);

			var parameterSlider = document.createElement("input");
			parameterSlider.type = "range";
			parameterSlider.min = displayParameter.min;
			parameterSlider.max = displayParameter.max;
			parameterSlider.step = displayParameter.step;
			parameterSlider.value = this.parameters[parameterKey];
			parameterSlider.addEventListener("input", sliderChangeCallback.bind(this, parameterKey, parameterDisplayNumber));
			parameterElement.appendChild(parameterSlider);

			controlPanel.appendChild(parameterElement);
		}

		var angularVelocityElement = document.createElement("div");
		angularVelocityElement.className = "parameter";

		var angularVelocityName = document.createElement("div");
		angularVelocityName.className = "parameterName";
		angularVelocityName.textContent = "Angular velocity (\u03C9)";
		angularVelocityElement.appendChild(angularVelocityName);

		var angularVelocityDisplay = document.createElement("div");
		angularVelocityElement.appendChild(angularVelocityDisplay);

		var angularVelocityReset = document.createElement("button");
		angularVelocityReset.textContent = "Reset";
		angularVelocityReset.addEventListener("click", () => {
			this.motor.resetAngularVelocity();
		});
		angularVelocityElement.appendChild(angularVelocityReset);

		controlPanel.appendChild(angularVelocityElement);

		this.parameters.dataCallback = function(angularVelocity: number) {
			angularVelocityDisplay.textContent = angularVelocity.toFixed(3);
		};
	}

	update() {
		const dt = this.clock.getDelta();

		this.motor.update(dt);

		this.controls.update();
	}

	draw() {
		this.renderer.render(this.scene, this.camera);
		// this.camera.position.y += 0.001;
	}
};