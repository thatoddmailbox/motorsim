import { BoxGeometry, Mesh, MeshLambertMaterial, Scene, Vector3 } from "three";

import { COLOR_FIELD_MAGNETIC, COLOR_MAGNET_NORTH, COLOR_MAGNET_SOUTH } from "consts.ts";
import VectorPlane from "VectorPlane.ts";

export default class PermanentMagnet {
	northPole: Mesh;
	southPole: Mesh;

	vectorPlane: VectorPlane;

	constructor(position: Vector3, scene: Scene) {
		const width = 1;
		const height = 2.5;
		const centerOffset = height / 2;

		const poleGeometry = new BoxGeometry(width, height, 1);

		/*
		 * poles
		 */
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

		/*
		 * vector field
		 */
		this.vectorPlane = new VectorPlane(
			new Vector3(this.northPole.position.x - (width / 2), this.northPole.position.y, this.northPole.position.z),
			new Vector3(this.southPole.position.x + (width / 2), this.southPole.position.y, this.southPole.position.z),
			height,
			new Vector3(0, 1, 0), // TODO: hardcoded
			COLOR_FIELD_MAGNETIC,
			scene
		);
	}
};
