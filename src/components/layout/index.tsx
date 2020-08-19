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
	uiSelectTraceColorAction,
	dataRemoveLatRouteAction,
} from "@/actions/trail.actions";
import { Vector3 } from "@babylonjs/core";
import { Legend } from "../legend";

const useStyles = createUseStyles(styles);

export const Layout: React.FC = () => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const editMode = useSelector((state: IStoreState) => state.trail.editMode);
	const inProgressRoute = useSelector((state: IStoreState) => state.trail.inProgressRoute);
	const routes = useSelector((state: IStoreState) => state.trail.routes);

	const isCancelable = inProgressRoute.traces.length === 0 && editMode;
	const isRouteRemovable = routes.length > 0 && !editMode;

	const onTraceClick = () => dispatch(uiToggleTraceAction(!editMode));
	const onMapClick = (point: Vector3) => dispatch(dataAddPointAction(point));
	const onUndoClick = () =>
		isCancelable
			? dispatch(uiToggleTraceAction(!editMode))
			: isRouteRemovable
			? dispatch(dataRemoveLatRouteAction())
			: dispatch(dataUndoAddPointAction());

	const onColorSelect = (color: string) => dispatch(uiSelectTraceColorAction(color));

	return (
		<div className={classes.container}>
			<Card>
				<div className={classes.header}>
					<div>Backpacking Trip Planner</div>
					<div>by Daniel Sklyar</div>
				</div>
			</Card>
			<Card>
				<TrailMap
					editMode={editMode}
					inProgressRoute={inProgressRoute}
					routes={routes}
					onMapClick={onMapClick}
				/>
				<Control
					editMode={editMode}
					isCancelable={isCancelable}
					onTraceClick={onTraceClick}
					onUndoClick={onUndoClick}
					onColorSelect={onColorSelect}
				/>
			</Card>
			<Card>
				<Legend />
			</Card>
		</div>
	);
};

const Card: React.FC = ({ children }) => {
	const classes = useStyles();
	return <div className={classes.card}>{children}</div>;
};
