export const styles = {
	"@global": {
		button: {
			padding: 0,
			border: "none",
			font: "inherit",
			color: "inherit",
			outline: "none",
			backgroundColor: "transparent",
			/* show a hand cursor on hover, some argue that we
			should keep the default arrow cursor for buttons */
			cursor: "pointer",
		},
		"input[type='radio']": {
			appearance: "none",
			outline: 0,
			padding: 0,
		},
		"body, #app": {
			margin: 0,
			padding: 0,
			height: "100vh",
			width: "100vw",
			backgroundColor: "#f5f5f5",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		},
		canvas: {
			outline: "none",
		},
	},
};
