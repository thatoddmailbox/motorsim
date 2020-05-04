import { BoxBufferGeometry, Mesh, MeshLambertMaterial, Scene, Vector3 } from "three";

import { COLOR_BRUSH_HOLDER } from "consts.ts";
import { addVectors } from "utils.ts";

import Commutator from "Commutator.ts";

export default class BrushHolder {
	mesh: Mesh;

	commutator: Commutator;

	constructor(position: Vector3, scene: Scene) {
		const width = 0.5;
		const height = 3.5;

		const geometry = new BoxBufferGeometry(width, height, 2);
		const material = new MeshLambertMaterial({ color: COLOR_BRUSH_HOLDER});

		this.mesh = new Mesh(geometry, material);
		this.mesh.position.copy(addVectors(position, new Vector3(0, height/2, 0)));
		scene.add(this.mesh);

		// this.commutator = new Commutator(position, scene);
	}
};