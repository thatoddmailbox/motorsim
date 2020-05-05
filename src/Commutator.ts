import { Matrix4, Mesh, MeshLambertMaterial, Scene, TorusBufferGeometry, Vector3 } from "three";
import { COLOR_COMMUTATOR } from "consts.ts";

export default class Commutator {
	mesh: Mesh;

	constructor(position: Vector3, bottom: boolean, scene: Scene) {
		const geometry = new TorusBufferGeometry(0.35, 0.2, 16, 30, Math.PI);
		geometry.applyMatrix4(new Matrix4().makeRotationY(Math.PI / 2));
		if (bottom) {
			geometry.applyMatrix4(new Matrix4().makeRotationX(Math.PI));
		}
		geometry.applyMatrix4(new Matrix4().makeTranslation(0, 0.01 * (bottom ? -1 : 0), 0));
		const material = new MeshLambertMaterial({ color: COLOR_COMMUTATOR });

		this.mesh = new Mesh(geometry, material);
		this.mesh.position.copy(position);
		scene.add(this.mesh);
	}

	setAngle(angle: number) {
		this.mesh.rotation.set(angle, 0, 0);
	}
};