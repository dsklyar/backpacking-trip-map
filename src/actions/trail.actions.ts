import { createAction } from "typesafe-actions";
import { ActionTypes } from "./actionTypes";
import { Vector3 } from "@babylonjs/core";

export const uiToggleTraceAction = createAction(ActionTypes.TRAIL.UI.TOGGLE_TRACE)<boolean>();
export const uiSelectTraceColorAction = createAction(ActionTypes.TRAIL.UI.SELECT_TRACE_COLOR)<
	string
>();
export const dataAddPointAction = createAction(ActionTypes.TRAIL.DATA.ADD_POINT)<Vector3>();
export const dataUndoAddPointAction = createAction(ActionTypes.TRAIL.DATA.UNDO_ADD_POINT)();
export const dataRemoveLatRouteAction = createAction(ActionTypes.TRAIL.DATA.REMOVE_LAST_ROUTE)();
