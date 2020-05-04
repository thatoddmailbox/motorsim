import { CatmullRomCurve3, Mesh, MeshLambertMaterial, Scene, TubeBufferGeometry, Vector3 } from "three";

import { COLOR_ARMATURE } from "consts.ts";
import { addVectors } from "utils.ts";

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
 * A = mainHeight
 * B = mainWidth
 * C = startHeight
 * D = startWidth
 * E = (mainHeight - startHeight) / 2
 * 
 * origin is at left center of diagram
 */
export default class Armature {
	curveObject: Mesh;

	constructor(position: Vector3, scene: Scene) {
		const wireRadius = 0.15;

		const mainWidth = 2;
		const mainHeight = 1.75;
		const startWidth = 1;
		const startHeight = 0.75;

		// points correspond to diagram
		// start at bottom left, continue clockwise
		const curve = new CatmullRomCurve3([
			addVectors(position, new Vector3(0, (startHeight / 2), 0)),
			addVectors(position, new Vector3(startWidth, (startHeight / 2), 0)),
			addVectors(position, new Vector3(startWidth, (mainHeight / 2), 0)),
			addVectors(position, new Vector3(startWidth + mainWidth, (mainHeight / 2), 0)),
			addVectors(position, new Vector3(startWidth + mainWidth, -(mainHeight / 2), 0)),
			addVectors(position, new Vector3(startWidth, -(mainHeight / 2), 0)),
			addVectors(position, new Vector3(startWidth, -(startHeight / 2), 0)),
			addVectors(position, new Vector3(0, -(startHeight / 2), 0))
		], false, "catmullrom", 0.15);

		const geometry = new TubeBufferGeometry(curve, 100, wireRadius, 12, false);
		geometry.center();
		
		const wireMaterial = new MeshLambertMaterial({ color: COLOR_ARMATURE });

		this.curveObject = new Mesh(geometry, wireMaterial);
		this.curveObject.position.copy(position);
		scene.add(this.curveObject);
	}

	update() {
		// this.curveObject.rotation.set(this.curveObject.rotation.x + 2 * (Math.PI / 180), 0, 0);
	}
};