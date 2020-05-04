import { ArrowHelper, Scene, Vector3 } from "three";

export default class VectorPlane {
	arrows: ArrowHelper[];

	constructor(from: Vector3, to: Vector3, height: number, heightDirection: Vector3, color: number, scene: Scene) {
		const direction = new Vector3(to.x, to.y, to.z).sub(from).normalize();
		const distance = to.distanceTo(from);

		const arrowLength = 1;
		const arrowSpace = 0.1;

		const arrowCount = Math.floor(distance / (arrowLength + arrowSpace));
		const leftoverSpace = distance - (arrowLength*arrowCount);
		const finalArrowSpacing = leftoverSpace / arrowCount;

		this.arrows = [];
		const directionIncrement = direction.clone().multiplyScalar(arrowLength + finalArrowSpacing);

		const rowHeight = 0.5;
		const rowCount = Math.floor((height / rowHeight) / 2);

		for (var rowIndex = -rowCount; rowIndex <= rowCount; rowIndex++) {
			var currentStart = from.clone();
			currentStart.add(heightDirection.clone().multiplyScalar(rowIndex * rowHeight));
			currentStart.add(direction.clone().multiplyScalar(finalArrowSpacing / 2));
			for (var arrowIndex = 0; arrowIndex < arrowCount; arrowIndex++) {
				const arrow = new ArrowHelper(direction, currentStart, arrowLength, color, 0.25, 0.25);

				scene.add(arrow);
				this.arrows.push(arrow);

				currentStart.add(directionIncrement);
			}
		}
	}
};