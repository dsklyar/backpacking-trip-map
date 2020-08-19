import { Nullable } from "@babylonjs/core";

import disasterPeak from "../textures/disaster_peak.png";
import lostCannonPeak from "../textures/lost_cannon_peak.png";
import dardanellesCone from "../textures/dardanelles_cone.png";
import dardanelle from "../textures/dardanelle.png";
import sonoraPass from "../textures/sonora_pass.png";
import pickelMeadow from "../textures/pickel_meadow.png";
import cooperPeak from "../textures/cooper_peak.png";
import emigrantLake from "../textures/emigrant_lake.png";
import towerPeak from "../textures/tower_peak.png";

export interface ITile {
	name: string;
	source: any;
}

export const TILE_MAP: Array<Array<ITile>> = [
	[
		{ name: "dardanellesCone", source: dardanellesCone },
		{ name: "disasterPeak", source: disasterPeak },
		{ name: "lostCannonPeak", source: lostCannonPeak },
	],
	[
		{ name: "dardanelle", source: dardanelle },
		{ name: "sonoraPass", source: sonoraPass },
		{ name: "pickelMeadow", source: pickelMeadow },
	],
	[
		{ name: "cooperPeak", source: cooperPeak },
		{ name: "emigrantLake", source: emigrantLake },
		{ name: "towerPeak", source: towerPeak },
	],
];
