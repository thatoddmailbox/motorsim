import { Vector3 } from "three";

export default interface MagneticField {
	getVector(): Vector3;
};