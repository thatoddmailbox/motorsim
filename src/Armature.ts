import { CatmullRomCurve3, Mesh, MeshLambertMaterial, Scene, TubeBufferGeometry, Vector3 } from "three";

import { COLOR_ARMATURE } from "consts.ts";
import { addVectors } from "utils.ts";

/*
 * very high quality diagram:
 * |--A--|
 * +-----+ -
 * |     | |
 * |     | B
 * |     | |
 * +-- --+ -
 *  -| |E|
 *  D| |
 *  -|_|
 *    C
 * 
 * A = mainWidth
 * B = mainHeight
 * C = startWidth
 * D = startHeight
 * E = (mainWidth - startWidth) / 2
 * 
 * origin is at bottom center of diagram
 */
export default class Armature {
	curveObject: Mesh;

	constructor(position: Vector3, scene: Scene) {
		const wireRadius = 0.125;

		const mainWidth = 1.5;
		const mainHeight = 2;
		const startWidth = 0.75;
		const startHeight = 1;

		// points correspond to diagram
		// start at bottom left, continue clockwise
		const curve = new CatmullRomCurve3([
			addVectors(position, new Vector3(-(startWidth / 2), 0, 0)),
			addVectors(position, new Vector3(-(startWidth / 2), startHeight, 0)),
			addVectors(position, new Vector3(-(mainWidth / 2), startHeight, 0)),
			addVectors(position, new Vector3(-(mainWidth / 2), startHeight + mainHeight, 0)),
			addVectors(position, new Vector3(mainWidth / 2, startHeight + mainHeight, 0)),
			addVectors(position, new Vector3(mainWidth / 2, startHeight, 0)),
			addVectors(position, new Vector3(startWidth / 2, startHeight, 0)),
			addVectors(position, new Vector3(startWidth / 2, 0, 0)),
		]);

		const geometry = new TubeBufferGeometry(curve, 75, wireRadius, 10, true);
		
		const wireMaterial = new MeshLambertMaterial({ color : COLOR_ARMATURE });

		this.curveObject = new Mesh(geometry, wireMaterial);

		scene.add(this.curveObject);
	}

	update() {
		// this.curveObject.rotateY(1 * (Math.PI / 180));
	}
};