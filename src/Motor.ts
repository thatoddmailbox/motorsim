import { Scene, Vector3 } from "three";

import Armature from "Armature.ts";
import PermanentMagnet from "PermanentMagnet.ts";

export default class Motor {
	armature: Armature;
	magnet: PermanentMagnet;

	constructor(position: Vector3, scene: Scene) {
		// permanent magnet
		this.magnet = new PermanentMagnet(position.clone().add(new Vector3(0, 0, -1)), scene);

		this.armature = new Armature(position, scene);
	}

	update() {
		this.armature.update();
	}
};