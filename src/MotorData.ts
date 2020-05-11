import { Vector3 } from "three";

export default interface MotorData {
	angularVelocity: number;
	
	commutatorVoltage: number;
	backEMF: number;
	armatureCurrent: number;
	topForce: Vector3;
};