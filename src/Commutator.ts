import { Matrix4, Mesh, MeshLambertMaterial, Scene, TorusBufferGeometry, Vector3 } from "three";

import { COLOR_POLARITY_NEUTRAL, COLOR_POLARITY_POSITIVE, COLOR_POLARITY_NEGATIVE } from "consts.ts";

import Polarity from "Polarity.ts";

export default class Commutator {
	mesh: Mesh;

	// TODO: these are duplicated for each commutator ring
	neutralMaterial: MeshLambertMaterial;
	positiveMaterial: MeshLambertMaterial;
	negativeMaterial: MeshLambertMaterial;

	constructor(position: Vector3, bottom: boolean, scene: Scene) {
		const geometry = new TorusBufferGeometry(0.35, 0.2, 16, 30, Math.PI);
		geometry.applyMatrix4(new Matrix4().makeRotationY(Math.PI / 2));
		if (bottom) {
			geometry.applyMatrix4(new Matrix4().makeRotationX(Math.PI));
		}
		geometry.applyMatrix4(new Matrix4().makeTranslation(0, 0.01 * (bottom ? -1 : 0), 0));

		this.neutralMaterial = new MeshLambertMaterial({ color: COLOR_POLARITY_NEUTRAL });
		this.positiveMaterial = new MeshLambertMaterial({ color: COLOR_POLARITY_POSITIVE });
		this.negativeMaterial = new MeshLambertMaterial({ color: COLOR_POLARITY_NEGATIVE });

		this.mesh = new Mesh(geometry, this.neutralMaterial);
		this.mesh.position.copy(position);
		scene.add(this.mesh);
	}

	setPolarity(polarity: Polarity) {
		if (polarity == Polarity.Positive) {
			this.mesh.material = this.positiveMaterial;
		} else if (polarity == Polarity.Negative) {
			this.mesh.material = this.negativeMaterial;
		} else {
			this.mesh.material = this.neutralMaterial;
		}
	}

	setAngle(angle: number) {
		this.mesh.rotation.set(angle, 0, 0);
	}
};