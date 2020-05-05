import { Scene, Vector3 } from "three";

import { addVectors } from "utils.ts";

import Battery from "Battery.ts";
import BrushHolder from "BrushHolder.ts";
import PermanentMagnet from "PermanentMagnet.ts";

export default class Motor {
	magnet: PermanentMagnet;

	battery: Battery;
	brushHolder: BrushHolder;

	constructor(position: Vector3, scene: Scene) {
		this.magnet = new PermanentMagnet(addVectors(position, new Vector3(2, 0, 0)), scene);

		this.battery = new Battery(2, addVectors(position, new Vector3(-2, 0, 0)), scene);
		this.brushHolder = new BrushHolder(position, scene);
	}

	update() {
		this.brushHolder.update();
	}
};