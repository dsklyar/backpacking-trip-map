import { Scene, Vector3, HemisphericLight } from "@babylonjs/core";

export class LightManager {
	private scene: Scene;
	private lightName: string;
	private light: HemisphericLight;

	constructor(scene: Scene, initialPosition: Vector3, lightName = "mainLight") {
		this.scene = scene;
		this.lightName = lightName;

		this.light = new HemisphericLight(this.lightName, initialPosition, this.scene);
	}

	public setIntensity(value: number): void {
		this.light.intensity = value;
	}
}
