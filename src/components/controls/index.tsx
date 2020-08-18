import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./styles";

const useStyles = createUseStyles(styles);

interface IProps {
	traceEnabled: boolean;
	onTraceClick: () => void;
	onUndoClick: () => void;
}

export const Control: React.FC<IProps> = ({ traceEnabled, onTraceClick, onUndoClick }: IProps) => {
	const classes = useStyles();

	return (
		<div className={classes.container}>
			<button className={classes.button} onClick={onTraceClick}>
				<span>Trace</span>
			</button>
			<button className={classes.button} onClick={onUndoClick}>
				<span>Undo</span>
			</button>
		</div>
	);
};
