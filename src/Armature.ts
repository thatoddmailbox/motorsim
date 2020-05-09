import { CatmullRomCurve3, Mesh, MeshLambertMaterial, Scene, TubeBufferGeometry, Vector3 } from "three";

import { COLOR_ARMATURE, COLOR_CURRENT, COLOR_TORQUE, METERS_TO_UNITS } from "consts.ts";
import { addVectors } from "utils.ts";

import Arrow from "Arrow.ts";
import MotorParameters from "MotorParameters.ts";
import Polarity from "Polarity.ts";

/*
 * very high quality diagram:
 *
 *  y
 *  ^
 *  |
 *  |
 *  ------>x
 * 
 *       +---------+ -
 *   |-D-|         | |
 *   +---+         | |
 * C |             | A
 *   +---+         | |
 *      E|         | |
 *      -+---------+ -
 *       |----B----|
 * 
 * A = ARMATURE_MAIN_HEIGHT
 * B = mainWidth
 * C = startHeight
 * D = startWidth
 * E = (ARMATURE_MAIN_HEIGHT - startHeight) / 2
 * 
 * origin is at left center of diagram
 * 
 * a positive current travels clockwise
 * a negative current travels counterclockwise
 */
const ARMATURE_START_WIDTH = 1;
const ARMATURE_START_HEIGHT = 0.75;
const ARMATURE_MAIN_HEIGHT = (1.75/24);

export default class Armature {
	curveObject: Mesh;
	topCurrentArrow: Arrow;
	bottomCurrentArrow: Arrow;
	topForceArrow: Arrow;
	bottomForceArrow: Arrow;

	position: Vector3;
	currentDirection: Polarity;
	parameters: MotorParameters;

	constructor(parameters: MotorParameters, position: Vector3, scene: Scene) {
		this.position = position;
		this.currentDirection = Polarity.Neutral;
		this.parameters = parameters;

		const wireRadius = 0.15;

		const mainWidth = parameters.armatureLength * METERS_TO_UNITS;
		const mainHeight = ARMATURE_MAIN_HEIGHT * METERS_TO_UNITS;

		// points correspond to diagram
		// start at bottom left, continue clockwise
		const curve = new CatmullRomCurve3([
			addVectors(position, new Vector3(0, (ARMATURE_START_HEIGHT / 2), 0)),
			addVectors(position, new Vector3(ARMATURE_START_WIDTH, (ARMATURE_START_HEIGHT / 2), 0)),
			addVectors(position, new Vector3(ARMATURE_START_WIDTH, (mainHeight / 2), 0)),
			addVectors(position, new Vector3(ARMATURE_START_WIDTH + mainWidth, (mainHeight / 2), 0)),
			addVectors(position, new Vector3(ARMATURE_START_WIDTH + mainWidth, -(mainHeight / 2), 0)),
			addVectors(position, new Vector3(ARMATURE_START_WIDTH, -(mainHeight / 2), 0)),
			addVectors(position, new Vector3(ARMATURE_START_WIDTH, -(ARMATURE_START_HEIGHT / 2), 0)),
			addVectors(position, new Vector3(0, -(ARMATURE_START_HEIGHT / 2), 0))
		], false, "catmullrom", 0.15);

		const geometry = new TubeBufferGeometry(curve, 100, wireRadius, 12, false);
		geometry.center();
		
		const wireMaterial = new MeshLambertMaterial({ color: COLOR_ARMATURE });

		this.curveObject = new Mesh(geometry, wireMaterial);
		this.curveObject.position.copy(position);

		// set up current arrows
		// default to the POSITIVE direction
		// we also hide them at the beginning so setCurrentDirection can update them
		const arrowSpacing = 0.2;

		this.topCurrentArrow = new Arrow(
			new Vector3(1, 0, 0),
			new Vector3(0, (mainHeight / 2) - wireRadius - arrowSpacing, 0),
			1,
			COLOR_CURRENT,
			255,
			0.25,
			0.25
		);
		this.topCurrentArrow.visible = false;
		this.curveObject.add(this.topCurrentArrow);

		this.bottomCurrentArrow = new Arrow(
			new Vector3(-1, 0, 0),
			new Vector3(1, -((mainHeight / 2) - wireRadius - arrowSpacing), 0),
			1,
			COLOR_CURRENT,
			255,
			0.25,
			0.25
		);
		this.bottomCurrentArrow.visible = false;
		this.curveObject.add(this.bottomCurrentArrow);

		// set up torque arrows
		// like the current arrows, default to POSITIVE direction and start hidden
		// the force arrows have to go in the SCENE and not the curve object!!!
		// this is because they're actual forces in the world space, instead of a helpful visual aid
		// their positions get updated by setForceDirections

		this.topForceArrow = new Arrow(
			new Vector3(0, 0, -1),
			new Vector3(0, 0, 0),
			1,
			COLOR_TORQUE,
			255,
			0.25,
			0.25
		);
		this.topForceArrow.visible = false;
		scene.add(this.topForceArrow);

		this.bottomForceArrow = new Arrow(
			new Vector3(0, 0, 1),
			new Vector3(0, 0, 0),
			1,
			COLOR_TORQUE,
			255,
			0.25,
			0.25
		);
		this.bottomForceArrow.visible = false;
		scene.add(this.bottomForceArrow);

		scene.add(this.curveObject);
	}

	setAngle(angle: number) {
		this.curveObject.rotation.set(angle, 0, 0);
	}

	setCurrentDirection(direction: Polarity) {
		this.currentDirection = direction;

		if (direction == Polarity.Positive || direction == Polarity.Negative) {
			this.topCurrentArrow.visible = true;
			this.bottomCurrentArrow.visible = true;
			this.topForceArrow.visible = true;
			this.bottomForceArrow.visible = true;

			var directionFactor = (direction == Polarity.Negative ? -1 : 1);

			this.topCurrentArrow.position.setX((direction == Polarity.Negative ? 1 : 0));
			this.topCurrentArrow.setDirection(new Vector3(directionFactor * 1, 0, 0));
			this.bottomCurrentArrow.position.setX((direction == Polarity.Negative ? 0 : 1));
			this.bottomCurrentArrow.setDirection(new Vector3(directionFactor * -1, 0, 0));
		} else {
			this.topCurrentArrow.visible = false;
			this.bottomCurrentArrow.visible = false;
			this.topForceArrow.visible = false;
			this.bottomForceArrow.visible = false;
		}
	}

	getInertia(): number {
		const radius = this.getRadius();
		// we model the armature as four rods
		// when the armature has an angle of 0, these are the two top and bottom ones, and the two side ones
		var inertia = 0;

		// top and bottom are rods
		return 1; // TODO
	}

	getRadius(): number {
		return ARMATURE_MAIN_HEIGHT / 2;
	}

	getLengthDirections() : Vector3[] {
		return [
			new Vector3((this.currentDirection == Polarity.Negative ? -1 : 1), 0, 0),
			new Vector3((this.currentDirection == Polarity.Negative ? 1 : -1), 0, 0),
		];
	}

	getTopPositions(currentAngle: number): number[] {
		const mainHeight = ARMATURE_MAIN_HEIGHT * METERS_TO_UNITS;

		return [
			(mainHeight / 2)*Math.cos(currentAngle - (Math.PI / 2)),
			(mainHeight / 2)*Math.sin(currentAngle - (Math.PI / 2))
		];
	}

	setForceDirections(topForceDirection: Vector3, bottomForceDirection: Vector3, currentAngle: number) {
		this.topForceArrow.setDirection(topForceDirection);
		this.bottomForceArrow.setDirection(bottomForceDirection);

		// we need to find the origin position for the vectors
		// looking DIRECTLY INTO commutator:
		// cos and sin of (angle - 90deg) give you x, y of top force
		// cos and sin of (angle + 90deg) give you x, y of bottom force
		// 90 deg = pi/2

		const [ topX, topY ] = this.getTopPositions(currentAngle);
		const bottomX = -topX; // same as Math.cos(currentAngle + (Math.PI / 2));
		const bottomY = -topY; // same as Math.sin(currentAngle + (Math.PI / 2));

		const armatureLengthUnits = this.parameters.armatureLength * METERS_TO_UNITS;

		// HOWEVER: that is in *that* coordinate system
		// (with an origin at the center of the commutator rings)
		// we want this in world space
		// commutator  |  world space
		// positive x --> positive z
		// negative y --> positive y
		// add this to the armature position, and you get your result
		this.topForceArrow.position.addVectors(this.position, new Vector3(ARMATURE_START_WIDTH + (armatureLengthUnits / 2) - 1.5, -topY, topX));
		this.bottomForceArrow.position.addVectors(this.position, new Vector3(ARMATURE_START_WIDTH + (armatureLengthUnits / 2) - 1.5, -bottomY, bottomX));
		// note: there's also a position offset in the x direction of 1.5 units that we accounted for
		// and we also combine the shift to the center in the x direction with the above calculations
	}

	update() {

	}
};