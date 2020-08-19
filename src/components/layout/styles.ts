export const styles = {
	container: {
		display: "flex",
		flexDirection: "column",
	},
	card: {
		marginTop: 20,
		boxSizing: "border-box",
		borderRadius: 4,
		padding: 20,
		backgroundColor: "#fff",
		boxShadow: `0px 2px 1px -1px rgba(0,0,0,0.2),
								0px 1px 1px 0px rgba(0,0,0,0.14),
								0px 1px 3px 0px rgba(0,0,0,0.12)`,
	},
	header: {
		"& > div": {
			fontFamily: "Roboto",
			display: "block",
		},
		"& > div:first-child": {
			fontSize: 26,
		},
		"& > div:last-child": {
			marginTop: 5,
			fontSize: 13,
		},
	},
};
