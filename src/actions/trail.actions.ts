import { createAction } from "typesafe-actions";
import { ActionTypes } from "./actionTypes";
import { Vector3 } from "@babylonjs/core";

export const uiToggleTraceAction = createAction(ActionTypes.TRAIL.UI.TOGGLE_TRACE)<boolean>();
export const dataAddPointAction = createAction(ActionTypes.TRAIL.DATA.ADD_POINT)<Vector3>();
export const dataUndoAddPointAction = createAction(ActionTypes.TRAIL.DATA.UNDO_ADD_POINT)();
