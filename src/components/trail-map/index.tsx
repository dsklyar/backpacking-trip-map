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

const useStyles = createUseStyles(styles);

interface IProps {
	traceEnabled: boolean;
	trailPoints: Vector3[];
	onMapClick: (point: Vector3) => void;
}

export const TrailMap: React.FC<IProps> = ({ traceEnabled, trailPoints, onMapClick }: IProps) => {
	const classes = useStyles();
	const [scene, setScene] = useState<Nullable<Scene>>(null);

	console.log("render TrailMap");

	useEffect(() => {
		if (scene) {
			scene.onPointerObservable.add(({ pickInfo }) => {
				// debugger;
				console.log(traceEnabled);
				if (!traceEnabled) {
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
	}, [onMapClick, scene, traceEnabled]);

	useEffect(() => {
		let traceMesh: Nullable<LinesMesh> = null;
		if (scene) {
			if (trailPoints.length > 1) {
				const a = Curve3.CreateCatmullRomSpline(trailPoints, trailPoints.length * 2, false);
				const path3d = new Path3D(a.getPoints());
				const curve = path3d.getCurve();
				traceMesh = Mesh.CreateLines("traceMesh", curve, scene);
				traceMesh.color = Color3.Red();
			}
		}
		return () => {
			if (traceMesh !== null) {
				scene?.removeMesh(traceMesh);
				traceMesh.dispose();
			}
		};
	}, [scene, trailPoints]);

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

		// Default intensity is 1. Let's dim the light a small amount
		light.intensity = 0.7;
		//#endregion

		//#region Map

		const tile_step = 6;
		const planeMeshes: Mesh[] = [];
		for (let rowIndex = 0; rowIndex < TILE_MAP.length; rowIndex++) {
			for (let tileIndex = 0; tileIndex < TILE_MAP[rowIndex].length; tileIndex++) {
				const tile = TILE_MAP[rowIndex][tileIndex];
				if (!tile) {
					continue;
				}
				const planeMesh = MeshBuilder.CreatePlane(
					`plane-${rowIndex}-${tileIndex}`,
					{ width: tile_step, height: tile_step },
					scene,
				);
				planeMesh.position = new Vector3(tileIndex * tile_step, rowIndex * -tile_step, 0);
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

		setScene(scene);
		//#endregion

		//#region Markers

		const mat = new StandardMaterial("discMat", scene);
		mat.diffuseColor = Color3.Red();
		const disc = MeshBuilder.CreateDisc("disc", { radius: 0.05, arc: 1, tessellation: 64 }, scene);
		disc.position = new Vector3(0, 0, -0.01);
		disc.material = mat;

		//#endregion

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).debugger = scene.debugLayer;
	};

	/**
	 * Will run on every frame render.  We are spinning the box on y-axis.
	 */
	const onRender = (scene: Scene): void => {
		// console.log(traceEnabled);
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
