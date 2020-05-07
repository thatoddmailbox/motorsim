export default interface MotorParameters {
	// battery voltage, in volts
	batteryVoltage: number;

	// armature length, in meters
	armatureLength: number;

	// armature resistance, in ohms
	armatureResistance: number;

	// stator field strength, in tesla
	statorFieldStrength: number;
};