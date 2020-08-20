import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./styles";
import "@babylonjs/inspector";
import {
	Vector3,
	MeshBuilder,
	Scene,
	Mesh,
	PointerEventTypes,
	Nullable,
	AssetsManager,
} from "@babylonjs/core";
import { TILE_MAP } from "../../utils/map-data";
import { Canvas } from "../canvas";
import { useState, useEffect } from "react";
import { IRoute } from "@/reducers/trail.reducer";
import { CameraManager } from "@/utils/cameraManager";
import { LightManager } from "@/utils/lightManager";
import { AppAssetManger } from "@/utils/appAssetManager";
import { RouteGraphic } from "@/utils/routeGraphic";

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

		const cameraInitPos = new Vector3(3, -3, -2);
		const cameraManager = new CameraManager(scene, cameraInitPos);

		const targetEndVector = new Vector3(4, -9, -2);
		cameraManager.moveTo(targetEndVector);

		const lightInitPos = new Vector3(0, 1, 0); // Vector(0,1,0) -> to the sky
		const lightManager = new LightManager(scene, lightInitPos);
		lightManager.setIntensity(0.1);

		const appAssetManger = new AppAssetManger(scene, assetManager);
		appAssetManger.queueMapTiles(TILE_MAP);

		// Build Map
		appAssetManger.load(() => {
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
					planeMesh.material = appAssetManger.materials[materialName];
					planeMeshes.push(planeMesh);
				}
			}
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).debugger = scene.debugLayer;
	};

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const onRender = (scene: Scene): void => {};

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
