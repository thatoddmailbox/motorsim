import { Scene, Vector3 } from "three";

import { addVectors } from "utils.ts";

import Battery from "Battery.ts";
import BrushHolder from "BrushHolder.ts";
import MotorParameters from "MotorParameters.ts";
import PermanentMagnet from "PermanentMagnet.ts";

export default class Motor {
	battery: Battery;
	brushHolder: BrushHolder;
	magnet: PermanentMagnet;

	parameters: MotorParameters;

	constructor(parameters: MotorParameters, position: Vector3, scene: Scene) {
		this.battery = new Battery(addVectors(position, new Vector3(-2, 0, 0)), scene);
		this.magnet = new PermanentMagnet(addVectors(position, new Vector3(2, 0, 0)), scene);

		this.brushHolder = new BrushHolder(parameters, this.magnet, position, scene);

		this.setParameters(parameters);
	}

	setParameters(parameters: MotorParameters) {
		this.parameters = parameters;
	}

	update() {
		this.brushHolder.update();
	}
};