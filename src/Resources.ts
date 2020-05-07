import { DataTexture, RGBFormat, RepeatWrapping } from "three";

export default class ResourceManager {
	static alphaMap: { [_index: number] : DataTexture };

	static init() {
		this.alphaMap = {};
	}

	static buildAlphaMap(opacity: number) {
		var alphaMapData = new Uint8Array(2 * 2 * 3);
		for (var i = 0; i < alphaMapData.length; i++) {
			alphaMapData[i] = opacity;
		}
		var alphaMap = new DataTexture(alphaMapData, 2, 2, RGBFormat);
		alphaMap.wrapS = RepeatWrapping;
		alphaMap.wrapT = RepeatWrapping;
		return alphaMap;
	}

	static getAlphaMap(opacity: number) {
		if (this.alphaMap[opacity]) {
			return this.alphaMap[opacity];
		}

		this.alphaMap[opacity] = this.buildAlphaMap(opacity);
		return this.alphaMap[opacity];
	}
};