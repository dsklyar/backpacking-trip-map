export const styles = {
	"@keyframes animateSlideIn": {
		"0%": {
			marginLeft: "60%",
		},
		"100%": {
			marginLeft: "0%",
		},
	},
	"@keyframes animateSlideOut": {
		"0%": {
			marginLeft: "0%",
		},
		"100%": {
			marginLeft: "60%",
		},
	},
	slideIn: {
		animation: "$animateSlideIn 0.5s",
	},
	slideOut: {
		animation: "$animateSlideOut 0.5s",
	},
};
