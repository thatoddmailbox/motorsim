import { Scene, Vector3 } from "three";

import Arrow from "Arrow.ts";

export default class VectorField {
	arrows: Arrow[];

	constructor(from: Vector3, to: Vector3, height: number, heightDirection: Vector3, depth: number, depthDirection: Vector3, color: number, scene: Scene) {
		const direction = new Vector3(to.x, to.y, to.z).sub(from).normalize();
		const distance = to.distanceTo(from);

		const arrowLength = 0.8;
		const arrowSpace = 0.1;

		const arrowCount = Math.floor(distance / (arrowLength + arrowSpace));
		const leftoverSpace = distance - (arrowLength*arrowCount);
		const finalArrowSpacing = leftoverSpace / arrowCount;

		this.arrows = [];
		const directionIncrement = direction.clone().multiplyScalar(arrowLength + finalArrowSpacing);

		const rowHeight = 0.5;
		const rowCount = Math.floor((height / rowHeight) / 2);

		const depthSize = 0.8;
		const depthFields = Math.floor((depth / depthSize) / 2);

		for (var depthField = -depthFields; depthField <= depthFields; depthField++) {
			var depthStart = from.clone();
			depthStart.add(depthDirection.clone().multiplyScalar(depthField * depthSize));
			for (var rowIndex = -rowCount; rowIndex <= rowCount; rowIndex++) {
				var currentStart = depthStart.clone();
				currentStart.add(heightDirection.clone().multiplyScalar(rowIndex * rowHeight));
				currentStart.add(direction.clone().multiplyScalar(finalArrowSpacing / 2));
				for (var arrowIndex = 0; arrowIndex < arrowCount; arrowIndex++) {
					const arrow = new Arrow(direction, currentStart, arrowLength, color, 128, 0.25, 0.25);

					scene.add(arrow);
					this.arrows.push(arrow);

					currentStart.add(directionIncrement);
				}
			}
		}
	}

	setVisible(visible: boolean) {
		for (var i = 0; i < this.arrows.length; i++) {
			this.arrows[i].visible = visible;
		}
	}
};