import { Reducer } from "redux";
import { Vector3 } from "@babylonjs/core";
import { ActionTypes } from "@/actions/actionTypes";
import { GRANITE_DOME_ROUTE } from "@/constants";

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

export interface IRoute {
	traces: Trace[];
	length: number;
	color: string;
	dirty: boolean;
}

const EMPTY_ROUTE: IRoute = {
	traces: [],
	length: 0,
	color: "#FF0000",
	dirty: false,
};

export interface ITrailState {
	editMode: boolean;
	routes: IRoute[];
	inProgressRoute: IRoute;
}

export const DEFAULT_TRAIL_STATE: ITrailState = {
	editMode: false,
	routes: [GRANITE_DOME_ROUTE],
	inProgressRoute: EMPTY_ROUTE,
};

export const trailReducer: Reducer<ITrailState, IAction> = (
	state = DEFAULT_TRAIL_STATE,
	action,
) => {
	switch (action.type) {
		case ActionTypes.TRAIL.UI.TOGGLE_TRACE: {
			const editMode = action.payload;
			if (!editMode) {
				return {
					...state,
					routes: state.inProgressRoute.dirty
						? [...state.routes, state.inProgressRoute]
						: state.routes,
					inProgressRoute: EMPTY_ROUTE,
					editMode,
				};
			}
			return {
				...state,
				editMode,
			};
		}
		case ActionTypes.TRAIL.DATA.ADD_POINT: {
			if (!state.editMode) {
				return state;
			}
			const isTraceStart = state.editMode && state.inProgressRoute.traces.length === 0;
			const newTrace: Trace = isTraceStart
				? { type: "start", point: action.payload }
				: { type: "path", point: action.payload };
			const updatedTraces = isTraceStart ? [newTrace] : [...state.inProgressRoute.traces, newTrace];
			return {
				...state,
				inProgressRoute: {
					...state.inProgressRoute,
					dirty: true,
					traces: updatedTraces,
					length: calculateDistance(updatedTraces),
				},
			};
		}
		case ActionTypes.TRAIL.DATA.UNDO_ADD_POINT: {
			if (!state.editMode) {
				return state;
			}

			const trimmedTraces = state.inProgressRoute.traces.length
				? [...state.inProgressRoute.traces.slice(0, -1)]
				: [];

			return {
				...state,
				inProgressRoute: {
					...state.inProgressRoute,
					traces: trimmedTraces,
					length: calculateDistance(trimmedTraces),
				},
			};
		}
		case ActionTypes.TRAIL.DATA.REMOVE_LAST_ROUTE: {
			return {
				...state,
				routes: state.routes.length ? [...state.routes.slice(0, -1)] : [],
			};
		}
		case ActionTypes.TRAIL.UI.SELECT_TRACE_COLOR: {
			if (state.editMode) {
				return {
					...state,
					inProgressRoute: {
						...state.inProgressRoute,
						color: action.payload,
					},
				};
			}
			return state;
		}
		default: {
			return state;
		}
	}
};

const calculateDistance = (traces: Trace[]): number => {
	let acc = 0;
	for (let i = 0; i < traces.length - 1; i++) {
		const traceA = traces[i];
		const traceB = traces[i + 1];
		const distance = Vector3.Distance(traceA.point, traceB.point);
		acc += distance;
	}
	return acc;
};
