export const styles = {
	container: {
		display: "flex",
		alignItems: "flex-end",
		"& > div": {
			display: "flex",
			flexDirection: "column",
			"& > span": {
				fontFamily: "Roboto",
				fontSize: 17,
				color: "#c4c4c4",
				margin: "10px auto",
				alignSelf: "center",
			},
		},
	},
	qeContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	wasdContainer: {
		width: "fit-content",
		"& > $key, > $active": {
			margin: "auto",
			marginTop: "2.5px",
			marginBottom: "2.5px",
		},
	},
	bottom: {
		display: "flex",
	},
	key: {
		margin: "2.5px",
		userSelect: "none",
		fontFamily: "Roboto",
		fontSize: 22,
		paddingTop: 12,
		paddingLeft: 10,
		boxSizing: "border-box",
		border: "1.5px solid #c4c4c4",
		borderRadius: 15,
		color: "#c4c4c4",
		width: 50,
		height: 50,
		display: "flex",
		// justifyContent: "center",
		alignItems: "center",
		boxShadow: `0px 2px 1px -1px rgba(0,0,0,0.2),
								0px 1px 1px 0px rgba(0,0,0,0.14),
								0px 1px 3px 0px rgba(0,0,0,0.12)`,
	},
	active: {
		extend: "key",
		backgroundColor: "#c4c4c4",
		color: "#fff",
		boxShadow: "none",
	},
};
