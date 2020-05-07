import { CylinderBufferGeometry, Object3D, Vector3, Mesh, MeshBasicMaterial } from "three";

import Resources from "Resources.ts";

// based on https://github.com/mrdoob/three.js/blob/master/src/helpers/ArrowHelper.js
export default class Arrow extends Object3D {
	axis: Vector3;

	lineGeometry: CylinderBufferGeometry;
	coneGeometry: CylinderBufferGeometry;

	line: Mesh;
	cone: Mesh;

	constructor(dir: Vector3, origin: Vector3, length: number, color: number, headLength?: number, headWidth?: number) {
		super();
		this.type = "Arrow";
		this.position.copy(origin);

		const lineRadius = 0.025;

		this.lineGeometry = new CylinderBufferGeometry(lineRadius, lineRadius, 1, 5, 1);

		this.coneGeometry = new CylinderBufferGeometry(0, 0.5, 1, 10, 1);
		this.coneGeometry.translate(0, -0.5, 0);

		this.line = new Mesh(this.lineGeometry, new MeshBasicMaterial({ color: color, alphaMap: Resources.arrowAlphaMap, transparent: true, toneMapped: false }));
		this.line.position.set(0, 0.3, 0);
		this.line.matrixAutoUpdate = false;
		this.add(this.line);
	
		this.cone = new Mesh(this.coneGeometry, new MeshBasicMaterial({ color: color, alphaMap: Resources.arrowAlphaMap, transparent: true, toneMapped: false }));
		this.cone.matrixAutoUpdate = false;
		this.add(this.cone);

		this.setDirection(dir);
		this.setLength(length, headLength, headWidth);
	}

	setDirection(dir: Vector3) {
		// dir is assumed to be normalized
		if (dir.y > 0.99999) {
			this.quaternion.set(0, 0, 0, 1);
		} else if (dir.y < -0.99999) {
			this.quaternion.set(1, 0, 0, 0);
		} else {
			this.axis.set(dir.z, 0, -dir.x).normalize();
	
			var radians = Math.acos(dir.y);
	
			this.quaternion.setFromAxisAngle(this.axis, radians);
		}
	}

	setLength(length: number, headLength?: number, headWidth?: number) {
		if (!headLength) {
			headLength = 0.2 * length;
		}
		if (!headWidth) {
			headWidth = 0.2 * headLength;
		}
	
		this.line.scale.set(1, Math.max(0.0001, length - headLength), 1);
		this.line.updateMatrix();
	
		this.cone.scale.set(headWidth, headLength, headWidth);
		this.cone.position.y = length;
		this.cone.updateMatrix();
	}
};