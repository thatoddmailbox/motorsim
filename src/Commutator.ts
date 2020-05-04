import { Mesh, MeshLambertMaterial, Scene, TorusBufferGeometry, Vector3 } from "three";
import { COLOR_COMMUTATOR } from "consts.ts";

export default class Commutator {
	mesh: Mesh;

	constructor(position: Vector3, scene: Scene) {
		const geometry = new TorusBufferGeometry(1, 0.5, 16, 50, Math.PI);
		const material = new MeshLambertMaterial({ color: COLOR_COMMUTATOR });

		this.mesh = new Mesh(geometry, material);
		this.mesh.position.copy(position);
		scene.add(this.mesh);
	}
};