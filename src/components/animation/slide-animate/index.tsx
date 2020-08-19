import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./styles";

const useStyles = createUseStyles(styles);

interface IProps {
	show: boolean;
}

export const SlideAnimate: React.FC<IProps> = ({ show, children }) => {
	const [shouldRender, setRender] = React.useState<boolean>(show);
	const classes = useStyles();

	React.useEffect(() => {
		if (show) {
			setRender(true);
		}
	}, [show]);

	const onAnimationEnd = () => {
		if (!show) {
			setRender(false);
		}
	};

	return (
		<div className={show ? classes.slideIn : classes.slideOut} onAnimationEnd={onAnimationEnd}>
			{shouldRender && children}
		</div>
	);
};
