import {
	Scene,
	Color3,
	StandardMaterial,
	LinesMesh,
	Nullable,
	Mesh,
	MeshBuilder,
	Vector3,
	Curve3,
	Path3D,
} from "@babylonjs/core";
import { IRoute } from "@/reducers/trail.reducer";

export class RouteGraphic {
	private scene: Scene;
	private route: IRoute;
	private routeName: string;

	private traceMesh: Nullable<LinesMesh> = null;
	private startNodeMesh: Nullable<Mesh> = null;
	private endNodeMesh: Nullable<Mesh> = null;

	constructor(scene: Scene, route: IRoute, routeName: string) {
		this.scene = scene;
		this.route = route;
		this.routeName = routeName;
	}

	public render(): void {
		const { color, traces } = this.route;
		const scene = this.scene;

		const name = `${this.routeName}-nodeMaterial`;
		const nodeMaterial = new StandardMaterial(name, scene);
		nodeMaterial.diffuseColor = Color3.FromHexString(color);

		if (traces.length > 0) {
			const { point } = traces[0];
			const name = `${this.routeName}-startNodeMesh`;
			this.startNodeMesh = MeshBuilder.CreateDisc(
				name,
				{ radius: 0.01, arc: 1, tessellation: 64 },
				scene,
			);
			this.startNodeMesh.position = new Vector3(point.x, point.y, -0.01);
			this.startNodeMesh.material = nodeMaterial;
		}

		if (traces.length > 1) {
			const { point } = traces[traces.length - 1];
			const name = `${this.routeName}-endNodeMesh`;
			this.endNodeMesh = MeshBuilder.CreateDisc(
				name,
				{ radius: 0.01, arc: 1, tessellation: 64 },
				scene,
			);
			this.endNodeMesh.position = new Vector3(point.x, point.y, -0.01);
			this.endNodeMesh.material = nodeMaterial;
		}

		if (traces.length > 1) {
			const points = traces.reduce((acc, { point }) => {
				acc.push(point);
				return acc;
			}, [] as Vector3[]);
			const catmul = Curve3.CreateCatmullRomSpline(points, points.length * 2, false);
			const path3d = new Path3D(catmul.getPoints());
			const curve = path3d.getCurve();
			const name = `${this.routeName}-traceMesh`;
			this.traceMesh = Mesh.CreateLines(name, curve, scene);
			this.traceMesh.color = Color3.FromHexString(color);
		}
	}

	public dispose(): void {
		const scene = this.scene;

		if (this.traceMesh !== null) {
			scene.removeMesh(this.traceMesh);
			this.traceMesh.dispose();
		}
		if (this.startNodeMesh !== null) {
			scene.removeMesh(this.startNodeMesh);
			this.startNodeMesh.dispose();
		}
		if (this.endNodeMesh !== null) {
			scene.removeMesh(this.endNodeMesh);
			this.endNodeMesh.dispose();
		}
	}
}
