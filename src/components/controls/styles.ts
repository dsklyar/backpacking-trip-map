export const styles = {
	container: {
		width: "100%",
		paddingTop: 10,
		display: "flex",
	},
	box: {
		display: "flex",
		alignItems: "center",
	},
	left: {
		extend: "box",
		width: "50%",
	},
	right: {
		extend: "box",
		width: "50%",
	},
	traceButton: {
		border: 0,
		"& > span": {
			color: "rgb(0 168 104)",
		},
		"&:hover": {
			backgroundColor: "rgb(0 168 104 / 0.2)",
		},
	},
	undoButton: {
		border: 0,
		"& > span": {
			color: "rgb(194 25 7)",
		},
		"&:hover": {
			backgroundColor: "rgb(194 25 7 / 0.2)",
		},
	},
};
