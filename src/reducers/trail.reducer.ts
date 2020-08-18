import { Reducer } from "redux";
import { Vector3 } from "@babylonjs/core";
import { ActionTypes } from "@/actions/actionTypes";

export interface ITrailState {
	points: Vector3[];
	traceEnabled: boolean;
}

export const DEFAULT_TRAIL_STATE: ITrailState = {
	points: [],
	traceEnabled: false,
};

export const trailReducer: Reducer<ITrailState, IAction> = (
	state = DEFAULT_TRAIL_STATE,
	action,
) => {
	switch (action.type) {
		case ActionTypes.TRAIL.UI.TOGGLE_TRACE: {
			return {
				...state,
				traceEnabled: action.payload,
			};
		}
		case ActionTypes.TRAIL.DATA.ADD_POINT: {
			return {
				...state,
				points: [...state.points, action.payload],
			};
		}
		case ActionTypes.TRAIL.DATA.UNDO_ADD_POINT: {
			return {
				...state,
				points: state.points.length ? [...state.points.slice(0, -1)] : [],
			};
		}
		default: {
			return state;
		}
	}
};
