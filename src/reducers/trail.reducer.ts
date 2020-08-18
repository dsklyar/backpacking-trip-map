import { Reducer } from "redux";
import { Vector3 } from "@babylonjs/core";
import { ActionTypes } from "@/actions/actionTypes";

interface IStartTrace {
	type: "start";
	point: Vector3;
}

interface IPathTrace {
	type: "path";
	point: Vector3;
}

interface IEndTrace {
	type: "end";
	point: Vector3;
}

export type Trace = IStartTrace | IPathTrace | IEndTrace;

export interface ITrailState {
	traces: Trace[];
	traceEnabled: boolean;
}

export const DEFAULT_TRAIL_STATE: ITrailState = {
	traces: [],
	traceEnabled: false,
};

export const trailReducer: Reducer<ITrailState, IAction> = (
	state = DEFAULT_TRAIL_STATE,
	action,
) => {
	switch (action.type) {
		case ActionTypes.TRAIL.UI.TOGGLE_TRACE: {
			const traceEnabled = action.payload;
			const updatedTraces = [...state.traces];
			if (updatedTraces.length > 1) {
				updatedTraces[updatedTraces.length - 1].type = traceEnabled ? "path" : "end";
			}
			return {
				...state,
				traceEnabled,
				traces: updatedTraces,
			};
		}
		case ActionTypes.TRAIL.DATA.ADD_POINT: {
			const isTraceStart = state.traceEnabled && state.traces.length === 0;
			const newTrace: Trace = isTraceStart
				? { type: "start", point: action.payload }
				: { type: "path", point: action.payload };
			return {
				...state,
				traces: isTraceStart ? [newTrace] : [...state.traces, newTrace],
			};
		}
		case ActionTypes.TRAIL.DATA.UNDO_ADD_POINT: {
			const trimmedTraces = state.traces.length ? [...state.traces.slice(0, -1)] : [];
			if (!state.traceEnabled && trimmedTraces.length > 1) {
				trimmedTraces[trimmedTraces.length - 1].type = "end";
			}
			return {
				...state,
				traces: trimmedTraces,
			};
		}
		default: {
			return state;
		}
	}
};
