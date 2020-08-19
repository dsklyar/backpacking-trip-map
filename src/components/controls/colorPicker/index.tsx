import * as React from "react";
import { useState } from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./styles";

interface IProps {
	colors: Array<{ name: string; value: string }>;
	startingIndex: number;
	onChange?: (index: number) => void;
}

const useStyles = createUseStyles(styles);

export const ColorPicker: React.FC<IProps> = React.memo(({ colors, startingIndex, onChange }) => {
	const classes = useStyles();
	const [checkedIndex, setCheckedIndex] = useState<number>(startingIndex);

	const onColorChange = (index: number) => {
		setCheckedIndex(index);
		onChange ? onChange(index) : null;
	};

	return (
		<div className={classes.container}>
			{colors.map(({ name, value }, index) => (
				<input
					key={`${name}`}
					className={classes.radio}
					type="radio"
					value={value}
					checked={index === checkedIndex}
					style={{ backgroundColor: value }}
					onChange={() => onColorChange(index)}
				/>
			))}
		</div>
	);
});

ColorPicker.displayName = "ColorPicker";
