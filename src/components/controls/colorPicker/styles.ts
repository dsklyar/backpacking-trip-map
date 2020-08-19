export const styles = {
	container: {
		display: "inline-block",
	},
	radio: {
		cursor: "pointer",
		display: "inline-block",
		opacity: 0.4,
		width: 20,
		height: 20,
		boxSizing: "border-box",
		borderRadius: 10,
		margin: 2.5,
		"&:checked": {
			opacity: 1,
			position: "relative",
			"&::after": {
				content: '""',
				position: "absolute",
				width: 10,
				height: 10,
				boxSizing: "border-box",
				borderRadius: 5,
				backgroundColor: "white",
				top: "25%",
				left: "25%",
			},
		},
	},
};
