import { Vector3 } from "three";

export function addVectors(a: Vector3, b: Vector3): Vector3 {
	return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
};