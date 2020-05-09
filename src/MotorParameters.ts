export default interface MotorParameters {
	// battery voltage, in volts
	batteryVoltage: number;

	// armature mass, in kilograms
	armatureMass: number;

	// armature length, in meters
	armatureLength: number;

	// armature resistance, in ohms
	armatureResistance: number;

	// stator field strength, in tesla
	statorFieldStrength: number;

	dataCallback(angularVelocity: number): void;
};