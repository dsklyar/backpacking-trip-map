import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./styles";
import "@babylonjs/inspector";
import {
	Vector3,
	HemisphericLight,
	MeshBuilder,
	Scene,
	Mesh,
	Texture,
	BackgroundMaterial,
	PointerEventTypes,
	FreeCamera,
	CubicEase,
	EasingFunction,
	Animation,
	Nullable,
	UniversalCamera,
	AssetsManager,
	TextureAssetTask,
} from "@babylonjs/core";
import { TILE_MAP } from "../../utils/map-data";
import { Canvas } from "../canvas";
import { useState, useEffect } from "react";
import { IRoute } from "@/reducers/trail.reducer";
import { RouteGraphic } from "@/utils/RouteGraphic";

const useStyles = createUseStyles(styles);

interface IProps {
	editMode: boolean;
	routes: IRoute[];
	inProgressRoute: IRoute;
	onMapClick: (point: Vector3) => void;
}

export const TrailMap: React.FC<IProps> = ({
	editMode,
	routes,
	inProgressRoute,
	onMapClick,
}: IProps) => {
	const classes = useStyles();
	const [scene, setScene] = useState<Nullable<Scene>>(null);

	console.log("render TrailMap");

	//#region On Pointer useEffect
	useEffect(() => {
		if (!scene) {
			return;
		}
		scene.onPointerObservable.add(({ pickInfo }) => {
			if (!editMode) {
				return;
			}
			if (pickInfo?.pickedPoint) {
				onMapClick(pickInfo?.pickedPoint);
			}
		}, PointerEventTypes.POINTERDOWN);
		return () => {
			scene?.onPointerObservable.clear();
		};
	}, [onMapClick, scene, editMode]);
	//#endregion

	//#region  InProgress Route Renderer useEffect
	useEffect(() => {
		if (!scene) {
			return;
		}
		const inProgressRouteGraphic = new RouteGraphic(scene, inProgressRoute, "inProgress");
		inProgressRouteGraphic.render();
		return () => {
			inProgressRouteGraphic.dispose();
		};
	}, [scene, inProgressRoute]);
	//#endregion

	//#region  Saved Routes Renderer useEffect
	useEffect(() => {
		if (!scene) {
			return;
		}
		const routeGraphics: RouteGraphic[] = [];
		routes.forEach((route, index) => {
			const graphic = new RouteGraphic(scene, route, `${index}-route`);
			graphic.render();
			routeGraphics.push(graphic);
		});
		return () => {
			routeGraphics.forEach((graphic) => graphic.dispose());
		};
	}, [scene, routes]);
	//#endregion

	const onSceneReady = (scene: Scene, assetManager: AssetsManager): void => {
		setScene(scene);

		//#region Camera

		// This creates and positions a free camera (non-mesh)
		const camera = new UniversalCamera("Camera", new Vector3(0, 0, -2), scene);

		// This targets the camera to scene origin
		camera.setTarget(Vector3.Zero());

		const canvas = scene.getEngine().getRenderingCanvas();
		if (!canvas) {
			return;
		}

		// This attaches the camera to the canvas
		camera.attachControl(canvas, true);
		camera.keysUpward.push(87);
		camera.keysDownward.push(83);
		camera.keysLeft.push(65);
		camera.keysRight.push(68);
		camera.keysUp.push(69);
		camera.keysDown.push(81);
		camera.inertia = 0.2;
		camera.speed = 0.2;

		// Camera limit preset
		scene.registerBeforeRender(() => {
			// prevent X/Y-axis camera rotation
			camera.rotation.x = 0;
			camera.rotation.y = 0;

			// prevent camera from dipping above -1 on Z-axis
			if (camera.position.z > -1) {
				const { x, y } = camera.position;
				camera.position.set(x, y, -1.01);
			}
		});

		// Camera Animations
		const moveCameraTo = (newPosition: Vector3, speed: number, camera: FreeCamera): void => {
			const ease = new CubicEase();
			ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
			Animation.CreateAndStartAnimation(
				"at5",
				camera,
				"target",
				speed,
				120,
				camera.target,
				newPosition,
				0,
				ease,
			);
			camera.update();
		};

		//#endregion

		//#region Light
		// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
		const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
		light.intensity = 0.5;
		//#endregion

		//#region Loading Assets
		const materials: { [key: string]: BackgroundMaterial } = {};
		for (let rowIndex = 0; rowIndex < TILE_MAP.length; rowIndex++) {
			for (let tileIndex = 0; tileIndex < TILE_MAP[rowIndex].length; tileIndex++) {
				const tile = TILE_MAP[rowIndex][tileIndex];
				if (!tile) {
					continue;
				}
				const textureName = `planeTexture-${rowIndex}-${tileIndex}`;
				const textureTask = assetManager.addTextureTask(textureName, tile.source);
				textureTask.onSuccess = (task: TextureAssetTask) => {
					const materialName = `planeMaterial-${rowIndex}-${tileIndex}`;
					const planeMaterial = new BackgroundMaterial(materialName, scene);
					planeMaterial.diffuseTexture = task.texture;
					materials[materialName] = planeMaterial;
				};
			}
		}
		assetManager.loadAsync();
		assetManager.onFinish = () => {
			console.info("FINISHED LOADING");
			buildMap();
		};
		//#endregion

		//#region Map
		const buildMap = (): void => {
			const col_step = 7;
			const row_step = 9;
			const planeMeshes: Mesh[] = [];
			for (let rowIndex = 0; rowIndex < TILE_MAP.length; rowIndex++) {
				for (let tileIndex = 0; tileIndex < TILE_MAP[rowIndex].length; tileIndex++) {
					const tile = TILE_MAP[rowIndex][tileIndex];
					if (!tile) {
						continue;
					}
					const planeMesh = MeshBuilder.CreatePlane(
						`plane-${rowIndex}-${tileIndex}`,
						{ width: col_step, height: row_step },
						scene,
					);
					planeMesh.position = new Vector3(tileIndex * col_step, rowIndex * -row_step, 0);
					const materialName = `planeMaterial-${rowIndex}-${tileIndex}`;
					planeMesh.material = materials[materialName];

					if (tile.name === "sonoraPass") {
						// moveCameraTo(planeMesh.position, 50, camera);
					}

					planeMeshes.push(planeMesh);
				}
			}
		};

		//#endregion

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).debugger = scene.debugLayer;
	};

	const onRender = (scene: Scene): void => {
		// console.log(editMode);
	};

	return (
		<div>
			<Canvas
				antialias={true}
				onSceneReady={onSceneReady}
				onRender={onRender}
				id="babylon-canvas"
				width={640}
				height={360}
			/>
		</div>
	);
};
