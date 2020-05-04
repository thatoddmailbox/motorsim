import { BoxGeometry, Mesh, MeshLambertMaterial, Scene, Vector3 } from "three";

import { COLOR_MAGNET_NORTH, COLOR_MAGNET_SOUTH } from "consts.ts";

export default class PermanentMagnet {
	northPole: Mesh;
	southPole: Mesh;

	constructor(position: Vector3, scene: Scene) {
		const height = 2.5;
		const centerOffset = height / 2;

		const poleGeometry = new BoxGeometry(1, height, 1);

		const northPoleMaterial = new MeshLambertMaterial({ color: COLOR_MAGNET_NORTH });
		const southPoleMaterial = new MeshLambertMaterial({ color: COLOR_MAGNET_SOUTH });

		this.northPole = new Mesh(poleGeometry, northPoleMaterial);
		this.southPole = new Mesh(poleGeometry, southPoleMaterial);
		this.northPole.castShadow = true;
		this.southPole.castShadow = true;

		this.northPole.position.set(position.x + 3, position.y + centerOffset, position.z);
		this.southPole.position.set(position.x - 3, position.y + centerOffset, position.z);

		scene.add(this.northPole);
		scene.add(this.southPole);
	}
};
