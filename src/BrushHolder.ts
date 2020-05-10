import { BoxBufferGeometry, Mesh, MeshLambertMaterial, Scene, Vector3 } from "three";

import { COLOR_BRUSH_HOLDER, COLOR_POLARITY_NEUTRAL, COLOR_POLARITY_POSITIVE, COLOR_POLARITY_NEGATIVE } from "consts.ts";
import { addVectors } from "utils.ts";

import Armature from "Armature.ts";
import Commutator from "Commutator.ts";
import MagneticField from "MagneticField.ts";
import MotorParameters from "MotorParameters.ts";
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

	field: MagneticField;
	parameters: MotorParameters;

	angle: number;
	angularVelocity: number;

	constructor(parameters: MotorParameters, field: MagneticField, position: Vector3, scene: Scene) {
		this.field = field;
		this.parameters = parameters;

		const width = 0.5;
		const height = 3.5;

		const armatureHeight = (2 * height)/3;

		this.neutralMaterial = new MeshLambertMaterial({ color: COLOR_POLARITY_NEUTRAL });
		this.positiveMaterial = new MeshLambertMaterial({ color: COLOR_POLARITY_POSITIVE });
		this.negativeMaterial = new MeshLambertMaterial({ color: COLOR_POLARITY_NEGATIVE });

		const brushGeometry = new BoxBufferGeometry(0.2, 0.2, 0.2);

		const holderGeometry = new BoxBufferGeometry(width, height, 2.75);
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

		this.armature = new Armature(parameters, addVectors(position, new Vector3(1.5, armatureHeight, 0)), scene);
		this.topCommutator = new Commutator(addVectors(position, new Vector3(width/2, armatureHeight, 0)), false, scene);
		this.bottomCommutator = new Commutator(addVectors(position, new Vector3(width/2, armatureHeight, 0)), true, scene);

		this.angularVelocity = 0;
		this.setAngle(0);
		this.setBrushPolarity(Polarity.Positive, Polarity.Negative);
	}

	setAngle(angle: number) {
		this.armature.setAngle(angle);
		this.topCommutator.setAngle(angle);
		this.bottomCommutator.setAngle(angle);

		if (angle < 0) {
			angle = (2 * Math.PI) + (angle % (2 * Math.PI));
		}
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

	resetAngularVelocity() {
		this.angularVelocity = 0;
	}

	update(dt: number) {
		this.armature.update();

		var topCommutatorPolarity = Polarity.Neutral;
		var bottomCommutatorPolarity = Polarity.Neutral;

		if (this.parameters.batteryVoltage != 0) {
			this.setBrushPolarity(Polarity.Positive, Polarity.Negative);

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
		} else {
			this.setBrushPolarity(Polarity.Neutral, Polarity.Neutral);
		}

		this.topCommutator.setPolarity(topCommutatorPolarity);
		this.bottomCommutator.setPolarity(bottomCommutatorPolarity);

		this.armature.setCurrentDirection(topCommutatorPolarity);

		// the part with the actual physics
		// first, we need to know the actual voltage at the commutator
		// this will be (battery voltage) - (back emf)
		// for back emf: faraday's law says it's the negative time derivative of magnetic flux
		// magnetic flux is B*A*sin(angle)
		// emf is therefore -B*A*omega*cos(angle)
		const backEMF = -(
			this.parameters.statorFieldStrength*this.armature.getArea()*
			this.angularVelocity*
			Math.cos(this.angle)
		);
		const commutatorVoltage = this.parameters.batteryVoltage + backEMF;

		// we want to know F = IL x B
		// so, find I with ohm's law: i = v/r
		const current = commutatorVoltage/this.parameters.armatureResistance;

		// find the length vectors and actual length
		const lengthDirections = this.armature.getLengthDirections();
		const length = this.parameters.armatureLength;

		// get the magnetic field vector
		const magneticFieldVector = this.field.getVector().multiplyScalar(this.parameters.statorFieldStrength);

		// do the math
		const topForce = lengthDirections[0].multiplyScalar(length * current).cross(magneticFieldVector);
		const bottomForce = lengthDirections[1].multiplyScalar(length * current).cross(magneticFieldVector);

		// if (isNaN(topForce.x) || isNaN(bottomForce.x)) {
		// 	console.log("1");
		// 	console.log("length", length);
		// 	console.log("current", current);
		// 	console.log("commutatorVoltage", commutatorVoltage);
		// 	console.log("this.parameters.batteryVoltage", this.parameters.batteryVoltage);
		// 	console.log("backEMF", backEMF);
		// 	console.log("topForce", topForce);
		// 	console.log("bottomForce", bottomForce);
		// 	alert("asdf");
		// }

		const topForceDirection = topForce.clone().normalize();
		const bottomForceDirection = bottomForce.clone().normalize();

		this.armature.setForceDirections(topForce.length() != 0 && topForceDirection, bottomForce.length() != 0 && bottomForceDirection, this.angle);

		// now we have the force, prepare to find torque
		// we need to find the lever arm first
		const [ topX, topY ] = this.armature.getTopPositions(this.angle);
		const bottomX = -topX;
		const bottomY = -topY;
		const leverArm = this.armature.getRadius();

		// see Armature.setForceDirections to see why this conversion makes sense
		const topLeverArm = new Vector3(0, -topY, topX).multiplyScalar(leverArm);
		const bottomLeverArm = new Vector3(0, -bottomY, bottomX).multiplyScalar(leverArm);

		// torque = r x F
		const topTorque = new Vector3().crossVectors(topLeverArm, topForce);
		const bottomTorque = new Vector3().crossVectors(bottomLeverArm, bottomForce);

		// TODO: we are making an assumption about how everything is axis-aligned
		// TODO: it works in *this* case, but if the motor was rotated, would be broken
		const topTorqueValue = topTorque.x;
		const bottomTorqueValue = bottomTorque.x;

		const inertia = this.armature.getInertia();

		// torque = i*alpha, so alpha = torque/i
		const topAcceleration = topTorqueValue/inertia;
		const bottomAcceleration = bottomTorqueValue/inertia;

		// by the magic of coordinate systems, this is consistent with three.js's rotation
		// in other words, we can just use the sign that came out of the cross product

		// now we know the acceleration, we apply to our velocity in one frame timestep
		this.angularVelocity += topAcceleration*dt;
		this.angularVelocity += bottomAcceleration*dt;

		// now we have updated the angular veloctiy, we can change the angle
		this.setAngle(this.angle + this.angularVelocity*dt);

		// report data to the main app
		if (this.parameters.dataCallback) {
			this.parameters.dataCallback(this.angularVelocity, backEMF, current);
		}
	}
};