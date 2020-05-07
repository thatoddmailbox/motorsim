import { DataTexture, RGBFormat, RepeatWrapping } from "three";

export default class ResourceManager {
	static arrowAlphaMap: DataTexture;
	static init() {
		const arrowAlpha = 128;
		var arrowAlphaMapData = new Uint8Array(2 * 2 * 3);
		for (var i = 0; i < arrowAlphaMapData.length; i++) {
			arrowAlphaMapData[i] = arrowAlpha;
		}
		this.arrowAlphaMap = new DataTexture(arrowAlphaMapData, 2, 2, RGBFormat);
		this.arrowAlphaMap.wrapS = RepeatWrapping;
		this.arrowAlphaMap.wrapT = RepeatWrapping;
	}
};