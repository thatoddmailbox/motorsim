import { BoxGeometry, Mesh, MeshLambertMaterial, Scene, Vector3 } from "three";

import { COLOR_FIELD_MAGNETIC, COLOR_MAGNET_NORTH, COLOR_MAGNET_SOUTH } from "consts.ts";

import MagneticField from "MagneticField.ts";
import VectorField from "VectorField.ts";

export default class PermanentMagnet implements MagneticField {
	northPole: Mesh;
	southPole: Mesh;

	vectorPlane: VectorField;

	constructor(position: Vector3, scene: Scene) {
		// pole size parameters
		const width = 2;
		const height = 0.75;
		const depth = 2.25;

		const poleDistance = 4;
		const centerOffset = height / 2;

		const poleGeometry = new BoxGeometry(width, height, depth);

		/*
		 * poles
		 */
		const northPoleMaterial = new MeshLambertMaterial({ color: COLOR_MAGNET_NORTH });
		const southPoleMaterial = new MeshLambertMaterial({ color: COLOR_MAGNET_SOUTH });

		this.northPole = new Mesh(poleGeometry, northPoleMaterial);
		this.southPole = new Mesh(poleGeometry, southPoleMaterial);
		this.northPole.castShadow = true;
		this.southPole.castShadow = true;

		this.northPole.position.set(position.x, position.y + centerOffset + poleDistance, position.z);
		this.southPole.position.set(position.x, position.y + centerOffset, position.z);

		scene.add(this.northPole);
		scene.add(this.southPole);

		/*
		 * vector field
		 */
		this.vectorPlane = new VectorField(
			new Vector3(this.northPole.position.x, this.northPole.position.y - centerOffset, this.northPole.position.z),
			new Vector3(this.southPole.position.x, this.southPole.position.y + centerOffset, this.southPole.position.z),
			width,
			new Vector3(1, 0, 0), // TODO: hardcoded
			depth,
			new Vector3(0, 0, 1), // TODO: hardcoded
			COLOR_FIELD_MAGNETIC,
			scene
		);
	}

	getVector(): Vector3 {
		return new Vector3(0, -1, 0);
	}

	setFieldVisible(visible: boolean) {
		this.vectorPlane.setVisible(visible);
	}
};
