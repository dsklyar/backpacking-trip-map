import * as React from "react";
import clsx from "clsx";
import { createUseStyles } from "react-jss";
import { styles } from "./styles";

const useStyles = createUseStyles(styles);

interface IProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	text?: string;
}

export const Button: React.FC<IProps> = ({ className, children, text, ...buttonProps }: IProps) => {
	const classes = useStyles();

	return (
		<button className={clsx(classes.button, className)} {...buttonProps}>
			{text && <span className={classes.text}>{text}</span>}
			{children}
		</button>
	);
};
