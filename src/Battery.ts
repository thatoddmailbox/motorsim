import { CylinderBufferGeometry, DataTexture, Matrix4, Mesh, MeshLambertMaterial, RGBFormat, Scene, Vector3, ClampToEdgeWrapping } from "three";

import { COLOR_BATTERY_POSITIVE, COLOR_BATTERY_LABEL, COLOR_BATTERY_NEGATIVE } from "consts.ts";
import { addVectors } from "utils.ts";

export default class Battery {
	constructor(position: Vector3, scene: Scene) {
		const radius = 0.4;
		const length = 2.75;

		// generate the battery texture programmatically

		const colorPositiveRed = (COLOR_BATTERY_POSITIVE & 0xff0000) >> 16;
		const colorPositiveGreen = (COLOR_BATTERY_POSITIVE & 0x00ff00) >> 8;
		const colorPositiveBlue = (COLOR_BATTERY_POSITIVE & 0xff);
		const colorLabelRed = (COLOR_BATTERY_LABEL & 0xff0000) >> 16;
		const colorLabelGreen = (COLOR_BATTERY_LABEL & 0x00ff00) >> 8;
		const colorLabelBlue = (COLOR_BATTERY_LABEL & 0xff);
		const sideTexturePositiveHeight = 5;
		const sideTextureHeight = 20;
		const sideTextureWidth = 2;

		var sideTextureData = new Uint8Array(sideTextureWidth * sideTextureHeight * 3);
		for (var row = 0; row < sideTextureHeight; row++) {
			for (var col = 0; col < sideTextureWidth; col++) {
				var i = ((sideTextureWidth * row) + col) * 3;

				if (row <= sideTexturePositiveHeight) {
					sideTextureData[i] = colorPositiveRed;
					sideTextureData[i+1] = colorPositiveGreen;
					sideTextureData[i+2] = colorPositiveBlue;
				} else {
					sideTextureData[i] = colorLabelRed;
					sideTextureData[i+1] = colorLabelGreen;
					sideTextureData[i+2] = colorLabelBlue;
				}
			}
		}

		var sideTexture = new DataTexture(sideTextureData, sideTextureWidth, sideTextureHeight, RGBFormat);
		sideTexture.wrapS = ClampToEdgeWrapping;
		sideTexture.wrapT = ClampToEdgeWrapping;

		const materials = [
			// side
			new MeshLambertMaterial({ map: sideTexture }),

			// front
			new MeshLambertMaterial({ color: COLOR_BATTERY_NEGATIVE }),

			// back
			new MeshLambertMaterial({ color: COLOR_BATTERY_POSITIVE })
		];

		const geometry = new CylinderBufferGeometry(radius, radius, length, 25, 10);
		geometry.applyMatrix4(new Matrix4().makeRotationX(Math.PI / 2));

		const mesh = new Mesh(geometry, materials);
		mesh.position.copy(addVectors(position, new Vector3(0, radius, 0)));
		scene.add(mesh);
	}
};