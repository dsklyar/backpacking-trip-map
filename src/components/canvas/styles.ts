export const styles = {
	"@global": {
		canvas: {
			width: (props: { width?: number }) => props?.width,
			height: (props: { height?: number }) => props?.height,
		},
	},
};
