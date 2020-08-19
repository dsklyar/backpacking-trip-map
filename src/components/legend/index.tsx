import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./styles";

const useStyles = createUseStyles(styles);

enum KeyEnum {
	W = "KeyW",
	A = "KeyA",
	S = "KeyS",
	D = "KeyD",
	E = "KeyE",
	Q = "KeyQ",
}

export const Legend: React.FC = React.memo(() => {
	const classes = useStyles();
	return (
		<div className={classes.container}>
			<div>
				<span>WASD to move</span>
				<div className={classes.wasdContainer}>
					<Key keyCode={KeyEnum.W} letter={"W"} />
					<div className={classes.bottom}>
						<Key keyCode={KeyEnum.A} letter={"A"} />
						<Key keyCode={KeyEnum.S} letter={"S"} />
						<Key keyCode={KeyEnum.D} letter={"D"} />
					</div>
				</div>
			</div>
			<div>
				<span>QE to zoom</span>
				<div className={classes.qeContainer}>
					<Key keyCode={KeyEnum.Q} letter={"Q"} />
					<Key keyCode={KeyEnum.E} letter={"E"} />
				</div>
			</div>
		</div>
	);
});

Legend.displayName = "Legend";

interface IProps {
	letter: string;
	keyCode: KeyEnum;
}

const Key: React.FC<IProps> = React.memo(({ letter, keyCode }) => {
	const classes = useStyles();
	const [keyToggled, setKeyToggle] = React.useState<boolean>(false);

	React.useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.code === keyCode && !keyToggled) {
				setKeyToggle(true);
			}
		};
		const onKeyUp = (e: KeyboardEvent) => {
			if (e.code === keyCode && keyToggled) {
				setKeyToggle(false);
			}
		};

		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("keyup", onKeyUp);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.removeEventListener("keyup", onKeyUp);
		};
	}, [keyCode, keyToggled]);

	const className = keyToggled ? classes.active : classes.key;

	return (
		<div className={className}>
			<span>{letter}</span>
		</div>
	);
});

Key.displayName = "Key";
