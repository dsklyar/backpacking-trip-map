import {
	Material,
	Scene,
	TextureAssetTask,
	BackgroundMaterial,
	AssetsManager,
} from "@babylonjs/core";
import { ITile } from "./map-data";

export interface IAppMaterials {
	[key: string]: Material;
}

export class AppAssetManger {
	private scene: Scene;
	private assetManager: AssetsManager;
	private _materials: IAppMaterials;
	constructor(scene: Scene, assetmanger: AssetsManager) {
		this.scene = scene;
		this.assetManager = assetmanger;
		this._materials = {};
	}

	public get materials(): IAppMaterials {
		return this._materials;
	}

	public queueMapTiles(tileMap: ITile[][]): void {
		for (let rowIndex = 0; rowIndex < tileMap.length; rowIndex++) {
			for (let tileIndex = 0; tileIndex < tileMap[rowIndex].length; tileIndex++) {
				const tile = tileMap[rowIndex][tileIndex];
				if (!tile) {
					continue;
				}
				const textureName = `planeTexture-${rowIndex}-${tileIndex}`;
				const textureTask = this.assetManager.addTextureTask(textureName, tile.source);
				textureTask.onSuccess = (task: TextureAssetTask) => {
					const materialName = `planeMaterial-${rowIndex}-${tileIndex}`;
					const planeMaterial = new BackgroundMaterial(materialName, this.scene);
					planeMaterial.diffuseTexture = task.texture;
					this.materials[materialName] = planeMaterial;
				};
			}
		}
	}

	public load(cb?: () => void): void {
		this.assetManager.load();
		cb ? (this.assetManager.onFinish = cb) : null;
	}
}
