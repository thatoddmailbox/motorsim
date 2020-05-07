import { BoxBufferGeometry, Mesh, MeshLambertMaterial, Scene, Vector3 } from "three";

import { COLOR_BRUSH_HOLDER, COLOR_POLARITY_NEUTRAL, COLOR_POLARITY_POSITIVE, COLOR_POLARITY_NEGATIVE } from "consts.ts";
import { addVectors } from "utils.ts";

import Armature from "Armature.ts";
import Commutator from "Commutator.ts";
import Polarity from "Polarity.ts";

export default class BrushHolder {
	holderMesh: Mesh;

	topBrush: Mesh;
	bottomBrush: Mesh;

	topBrushPolarity: Polarity;
	bottomBrushPolarity: Polarity;

	armature: Armature;
	topCommutator: Commutator;
	bottomCommutator: Commutator;

	// TODO: these are duplicated in the commutator class
	neutralMaterial: MeshLambertMaterial;
	positiveMaterial: MeshLambertMaterial;
	negativeMaterial: MeshLambertMaterial;

	angle: number;

	constructor(position: Vector3, scene: Scene) {
		const width = 0.5;
		const height = 3.5;

		const armatureHeight = (2 * height)/3;

		this.neutralMaterial = new MeshLambertMaterial({ color: COLOR_POLARITY_NEUTRAL });
		this.positiveMaterial = new MeshLambertMaterial({ color: COLOR_POLARITY_POSITIVE });
		this.negativeMaterial = new MeshLambertMaterial({ color: COLOR_POLARITY_NEGATIVE });

		const brushGeometry = new BoxBufferGeometry(0.2, 0.2, 0.2);

		const holderGeometry = new BoxBufferGeometry(width, height, 2);
		const holderMaterial = new MeshLambertMaterial({ color: COLOR_BRUSH_HOLDER });

		// main holder
		this.holderMesh = new Mesh(holderGeometry, holderMaterial);
		this.holderMesh.position.copy(addVectors(position, new Vector3(0, height/2, 0)));
		scene.add(this.holderMesh);

		const brushOffset = (0.35 + 0.2 + 0.1) - 0.01;

		// top brush
		this.topBrush = new Mesh(brushGeometry, this.neutralMaterial);
		this.topBrush.position.copy(addVectors(position, new Vector3(width/2 + 0.05, armatureHeight + brushOffset, 0)));
		scene.add(this.topBrush);

		// bottom brush
		this.bottomBrush = new Mesh(brushGeometry, this.neutralMaterial);
		this.bottomBrush.position.copy(addVectors(position, new Vector3(width/2 + 0.05, armatureHeight - brushOffset, 0)));
		scene.add(this.bottomBrush);

		this.armature = new Armature(addVectors(position, new Vector3(1.5, armatureHeight, 0)), scene);
		this.topCommutator = new Commutator(addVectors(position, new Vector3(width/2, armatureHeight, 0)), false, scene);
		this.bottomCommutator = new Commutator(addVectors(position, new Vector3(width/2, armatureHeight, 0)), true, scene);

		this.setAngle(0);
		this.setBrushPolarity(Polarity.Positive, Polarity.Negative);
	}

	setAngle(angle: number) {
		this.armature.setAngle(angle);
		this.topCommutator.setAngle(angle);
		this.bottomCommutator.setAngle(angle);

		this.angle = angle % (2 * Math.PI);
	}

	setBrushPolarity(topBrushPolarity: Polarity, bottomBrushPolarity: Polarity) {
		this.topBrushPolarity = topBrushPolarity;
		this.bottomBrushPolarity = bottomBrushPolarity;

		if (this.topBrushPolarity == Polarity.Positive) {
			this.topBrush.material = this.positiveMaterial;
		} else if (this.topBrushPolarity == Polarity.Negative) {
			this.topBrush.material = this.negativeMaterial;
		} else {
			this.topBrush.material = this.neutralMaterial;
		}

		if (this.bottomBrushPolarity == Polarity.Positive) {
			this.bottomBrush.material = this.positiveMaterial;
		} else if (this.bottomBrushPolarity == Polarity.Negative) {
			this.bottomBrush.material = this.negativeMaterial;
		} else {
			this.bottomBrush.material = this.neutralMaterial;
		}
	}

	update() {
		// this.setAngle(this.angle + 2 * (Math.PI / 180));

		this.armature.update();

		var topCommutatorPolarity = Polarity.Neutral;
		var bottomCommutatorPolarity = Polarity.Neutral;

		if (this.angle < (Math.PI / 2) || this.angle > ((3 * Math.PI) / 2)) {
			topCommutatorPolarity = this.topBrushPolarity;
			bottomCommutatorPolarity = this.bottomBrushPolarity;
		} else if (this.angle > (Math.PI / 2) && this.angle < ((3 * Math.PI) / 2)) {
			topCommutatorPolarity = this.bottomBrushPolarity;
			bottomCommutatorPolarity = this.topBrushPolarity;
		} else {
			topCommutatorPolarity = Polarity.Neutral;
			bottomCommutatorPolarity = Polarity.Neutral;
		}

		this.topCommutator.setPolarity(topCommutatorPolarity);
		this.bottomCommutator.setPolarity(bottomCommutatorPolarity);
	}
};