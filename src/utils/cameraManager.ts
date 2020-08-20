import {
	Scene,
	UniversalCamera,
	Vector3,
	CubicEase,
	EasingFunction,
	Animation,
} from "@babylonjs/core";

export class CameraManager {
	private scene: Scene;
	private cameraName: string;
	private camera: UniversalCamera;

	constructor(scene: Scene, initialPosition: Vector3, cameraName = "MainCamera") {
		this.scene = scene;
		this.cameraName = cameraName;

		// This creates and positions a free camera (non-mesh)
		this.camera = new UniversalCamera(this.cameraName, initialPosition, this.scene);

		// This targets the camera to scene origin
		this.camera.setTarget(Vector3.Zero());

		// Setup and attach controls
		this.setupControls();

		// Setup camera movement limits
		this.setupLimits();
	}

	public moveTo(position: Vector3, speed = 20): void {
		const ease = new CubicEase();
		ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);

		const animationName = "camera-animation";
		const propertyTarget = "position";

		Animation.CreateAndStartAnimation(
			animationName,
			this.camera,
			propertyTarget,
			speed,
			120,
			this.camera.position,
			position,
			Animation.ANIMATIONLOOPMODE_CONSTANT,
			ease,
		);
	}

	private setupControls(): void {
		const canvas = this.scene.getEngine().getRenderingCanvas();
		if (!canvas) {
			return;
		}

		// This attaches the camera to the canvas
		this.camera.attachControl(canvas, true);
		this.camera.keysUpward.push(87);
		this.camera.keysDownward.push(83);
		this.camera.keysLeft.push(65);
		this.camera.keysRight.push(68);
		this.camera.keysUp.push(69);
		this.camera.keysDown.push(81);
		this.camera.inertia = 0.2;
		this.camera.speed = 0.2;
	}

	private setupLimits(): void {
		// Camera limit preset
		this.scene.registerBeforeRender(() => {
			// prevent X/Y-axis camera rotation
			this.camera.rotation.x = 0;
			this.camera.rotation.y = 0;

			// prevent camera from dipping above -1 on Z-axis
			if (this.camera.position.z > -1) {
				const { x, y } = this.camera.position;
				this.camera.position.set(x, y, -1.01);
			}
		});
	}
}
