import { CylinderBufferGeometry, Matrix4, Mesh, MeshLambertMaterial, Scene, Vector3 } from "three";

import { COLOR_BATTERY } from "consts.ts";
import { addVectors } from "utils.ts";

export default class Battery {
	constructor(position: Vector3, scene: Scene) {
		const radius = 0.4;
		const length = 2.75;

		const geometry = new CylinderBufferGeometry(radius, radius, length, 25, 10);
		geometry.applyMatrix4(new Matrix4().makeRotationX(Math.PI / 2));
		const material = new MeshLambertMaterial({ color: COLOR_BATTERY });

		const mesh = new Mesh(geometry, material);
		mesh.position.copy(addVectors(position, new Vector3(0, radius, 0)));
		scene.add(mesh);
	}
};