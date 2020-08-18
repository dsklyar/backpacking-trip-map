import { ITrailState, DEFAULT_TRAIL_STATE, trailReducer } from "./trail.reducer";
import { combineReducers } from "redux";
import { useSelector } from "react-redux";

export interface IStoreState {
	trail: ITrailState;
}

export const DEFAULT_ROOT_STATE: IStoreState = {
	trail: DEFAULT_TRAIL_STATE,
};

export const createRootReducer = () =>
	combineReducers({
		trail: trailReducer,
	});
