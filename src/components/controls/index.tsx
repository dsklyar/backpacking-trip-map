import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./styles";
import { ColorPicker } from "./colorPicker";
import { Button } from "./button";

const useStyles = createUseStyles(styles);

interface IProps {
	editMode: boolean;
	onTraceClick?: () => void;
	onUndoClick?: () => void;
	onColorSelect?: (color: string) => void;
}

export const Control: React.FC<IProps> = ({
	editMode,
	onTraceClick,
	onUndoClick,
	onColorSelect,
}: IProps) => {
	const classes = useStyles();

	const traceBtnText = editMode ? "Save Route" : "New Route";
	const undoBtnText = editMode ? "Undo Segment" : "Undo Route";

	const colors = [
		{ name: "red", value: "#FF0000" },
		{ name: "blue", value: "#0000FF" },
		{ name: "green", value: "#008000" },
		{ name: "gold", value: "#FFD700" },
	];

	const onChange = (index: number): void => {
		onColorSelect ? onColorSelect(colors[index].value) : null;
	};

	return (
		<div className={classes.container}>
			<div className={classes.left}>
				<Button text={traceBtnText} onClick={onTraceClick} className={classes.traceButton} />
				<Button text={undoBtnText} onClick={onUndoClick} className={classes.undoButton} />
			</div>
			<div className={classes.right}>
				<ColorPicker colors={colors} startingIndex={0} onChange={onChange} />
			</div>
		</div>
	);
};
