import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./styles";
import { useState, useEffect, useRef } from "react";
import {
	Engine,
	Scene,
	EngineOptions,
	SceneOptions,
	Nullable,
	AssetsManager,
} from "@babylonjs/core";

const useStyles = createUseStyles(styles);

interface IProps {
	id: string;
	width?: number;
	height?: number;
	antialias?: boolean;
	engineOptions?: EngineOptions;
	adaptToDeviceRatio?: boolean;
	sceneOptions?: SceneOptions;
	onRender: (scene: Scene) => void;
	onSceneReady: (scene: Scene, assetManger: AssetsManager) => void;
}

export const Canvas: React.FC<IProps> = (props: IProps) => {
	const classes = useStyles(props);
	const reactCanvas = useRef<Nullable<HTMLCanvasElement>>(null);
	const [loaded, setLoaded] = useState(false);
	const [scene, setScene] = useState<Nullable<Scene>>(null);

	console.log("render Canvas");

	const {
		antialias,
		engineOptions,
		adaptToDeviceRatio,
		sceneOptions,
		onRender,
		onSceneReady,
		...rest
	} = props;

	useEffect(() => {
		if (window) {
			const resize = () => {
				if (scene) {
					scene.getEngine().resize();
				}
			};
			const onKeyDown = (e: KeyboardEvent) => {
				switch (e.code) {
					case "KeyW" || "KeyA" || "KeyS" || "KeyD" || "KeyQ" || "KeyE": {
						if (reactCanvas && reactCanvas.current) reactCanvas.current.focus();
					}
				}
			};

			window.addEventListener("resize", resize);
			document.addEventListener("keydown", onKeyDown);
			return () => {
				window.removeEventListener("resize", resize);
				document.removeEventListener("keydown", onKeyDown);
			};
		}
	}, [scene]);

	useEffect(() => {
		if (!loaded) {
			setLoaded(true);
			const engine = new Engine(reactCanvas.current, antialias, engineOptions, adaptToDeviceRatio);
			const scene = new Scene(engine, sceneOptions);
			const assetManger = new AssetsManager(scene);
			setScene(scene);
			if (scene.isReady()) {
				onSceneReady(scene, assetManger);
			} else {
				scene.onReadyObservable.addOnce((scene: Scene) => onSceneReady(scene, assetManger));
			}

			engine.runRenderLoop(() => {
				if (typeof onRender === "function") {
					onRender(scene);
				}
				scene.render();
			});
		}

		return () => {
			if (scene !== null) {
				console.info("RIP SCENE");
				// Probably dont want to RIP the whole scene, unless I need to recreate from scratch
				// scene.dispose();
			}
		};
	}, [reactCanvas]);

	return <canvas ref={reactCanvas} {...rest} />;
};
