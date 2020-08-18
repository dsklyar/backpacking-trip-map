import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./styles";
import { TrailMap } from "../trail-map";
import { Control } from "../controls";
import { useSelector, useDispatch } from "react-redux";
import { IStoreState } from "@/reducers";
import {
	uiToggleTraceAction,
	dataUndoAddPointAction,
	dataAddPointAction,
} from "@/actions/trail.actions";
import { Vector3 } from "@babylonjs/core";

const useStyles = createUseStyles(styles);

export const Layout: React.FC = () => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const traceEnabled = useSelector((state: IStoreState) => state.trail.traceEnabled);
	const trailPoints = useSelector((state: IStoreState) => state.trail.points);

	const onTraceClick = () => dispatch(uiToggleTraceAction(!traceEnabled));
	const onMapClick = (point: Vector3) => dispatch(dataAddPointAction(point));
	const onUndoClick = () => dispatch(dataUndoAddPointAction());

	return (
		<div className={classes.container}>
			<TrailMap traceEnabled={traceEnabled} trailPoints={trailPoints} onMapClick={onMapClick} />
			<Control traceEnabled={traceEnabled} onTraceClick={onTraceClick} onUndoClick={onUndoClick} />
		</div>
	);
};
