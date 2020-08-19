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
	Path3D,
	Color3,
	Nullable,
	LinesMesh,
	UniversalCamera,
	StandardMaterial,
	Curve3,
} from "@babylonjs/core";
import { TILE_MAP } from "./map-data";
import { Canvas } from "../canvas";
import { useState, useEffect } from "react";
import { Trace, IRoute } from "@/reducers/trail.reducer";

const useStyles = createUseStyles(styles);

interface IProps {
	editMode: boolean;
	inProgressRoute: IRoute;
	onMapClick: (point: Vector3) => void;
}

export const TrailMap: React.FC<IProps> = ({ editMode, inProgressRoute, onMapClick }: IProps) => {
	const classes = useStyles();
	const [scene, setScene] = useState<Nullable<Scene>>(null);

	const { traces, color } = inProgressRoute;

	console.log("render TrailMap");

	useEffect(() => {
		if (scene) {
			scene.onPointerObservable.add(({ pickInfo }) => {
				if (!editMode) {
					return;
				}
				if (pickInfo?.pickedPoint) {
					onMapClick(pickInfo?.pickedPoint);
				}
			}, PointerEventTypes.POINTERDOWN);
		}
		return () => {
			scene?.onPointerObservable.clear();
		};
	}, [onMapClick, scene, editMode]);

	useEffect(() => {
		let traceMesh: Nullable<LinesMesh> = null;
		let startNodeMesh: Nullable<Mesh> = null;
		let endNodeMesh: Nullable<Mesh> = null;

		if (!scene) {
			return;
		}

		const nodeMaterial = new StandardMaterial("nodeMaterial", scene);
		nodeMaterial.diffuseColor = Color3.FromHexString(color);

		if (traces.length > 0) {
			const { point } = traces[0];
			startNodeMesh = MeshBuilder.CreateDisc(
				"startNodeMesh",
				{ radius: 0.01, arc: 1, tessellation: 64 },
				scene,
			);
			startNodeMesh.position = new Vector3(point.x, point.y, -0.01);
			startNodeMesh.material = nodeMaterial;
		}

		if (!editMode && traces.length > 1) {
			const { point } = traces[traces.length - 1];
			endNodeMesh = MeshBuilder.CreateDisc(
				"endNodeMesh",
				{ radius: 0.01, arc: 1, tessellation: 64 },
				scene,
			);
			endNodeMesh.position = new Vector3(point.x, point.y, -0.01);
			endNodeMesh.material = nodeMaterial;
		}

		if (traces.length > 1) {
			const points = traces.reduce((acc, { point }) => {
				acc.push(point);
				return acc;
			}, [] as Vector3[]);
			const catmul = Curve3.CreateCatmullRomSpline(points, points.length * 2, false);
			const path3d = new Path3D(catmul.getPoints());
			const curve = path3d.getCurve();
			traceMesh = Mesh.CreateLines("traceMesh", curve, scene);
			traceMesh.color = Color3.FromHexString(color);
		}

		return () => {
			if (traceMesh !== null) {
				scene?.removeMesh(traceMesh);
				traceMesh.dispose();
			}
			if (startNodeMesh !== null) {
				scene?.removeMesh(startNodeMesh);
				startNodeMesh.dispose();
			}
			if (endNodeMesh !== null) {
				scene?.removeMesh(endNodeMesh);
				endNodeMesh.dispose();
			}
		};
	}, [scene, editMode, traces, color]);

	const onSceneReady = (scene: Scene): void => {
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

		const mat = camera.getProjectionMatrix();
		console.log(mat);

		// Camera limit preset
		scene.registerBeforeRender(() => {
			// prevent X/Y-axis camera rotation
			camera.rotation.x = 0;
			camera.rotation.y = 0;

			// const projectionMatrix = camera.getProjectionMatrix();
			// const frustrumPlanes = Frustum.GetPlanes(projectionMatrix);
			// console.log(frustrumPlanes);

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

		// Default intensity is 1. Let's dim the light a small amount
		light.intensity = 0.7;
		//#endregion

		//#region Map

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
				const planeMaterial = new BackgroundMaterial(
					`planeMaterial-${rowIndex}-${tileIndex}`,
					scene,
				);
				planeMaterial.diffuseTexture = new Texture(tile.source, scene);
				planeMesh.material = planeMaterial;

				if (tile.name === "sonoraPass") {
					// moveCameraTo(planeMesh.position, 50, camera);
				}

				planeMeshes.push(planeMesh);
			}
		}

		// planeMeshes.forEach

		setScene(scene);
		//#endregion

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).debugger = scene.debugLayer;
	};

	/**
	 * Will run on every frame render.  We are spinning the box on y-axis.
	 */
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
