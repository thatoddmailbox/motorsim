import { BoxBufferGeometry, Mesh, MeshLambertMaterial, Scene, Vector3 } from "three";

import { COLOR_BRUSH_HOLDER } from "consts.ts";
import { addVectors } from "utils.ts";

import Armature from "Armature.ts";
import Commutator from "Commutator.ts";

export default class BrushHolder {
	mesh: Mesh;

	armature: Armature;
	topCommutator: Commutator;
	bottomCommutator: Commutator;

	angle: number;

	constructor(position: Vector3, scene: Scene) {
		const width = 0.5;
		const height = 3.5;

		const geometry = new BoxBufferGeometry(width, height, 2);
		const material = new MeshLambertMaterial({ color: COLOR_BRUSH_HOLDER});

		this.mesh = new Mesh(geometry, material);
		this.mesh.position.copy(addVectors(position, new Vector3(0, height/2, 0)));
		scene.add(this.mesh);

		const armatureHeight = (2 * height)/3;

		this.armature = new Armature(addVectors(position, new Vector3(1.5, armatureHeight, 0)), scene);
		this.topCommutator = new Commutator(addVectors(position, new Vector3(width/2, armatureHeight, 0)), false, scene);
		this.bottomCommutator = new Commutator(addVectors(position, new Vector3(width/2, armatureHeight, 0)), true, scene);

		this.angle = 0;
	}

	setAngle(angle: number) {
		this.armature.setAngle(angle);
		this.topCommutator.setAngle(angle);
		this.bottomCommutator.setAngle(angle);

		this.angle = angle;
	}

	update() {
		this.setAngle(this.angle + 2 * (Math.PI / 180));

		this.armature.update();
	}
};