/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	// mode: "production",

	// Enable sourcemaps for debugging webpack's output.
	// devtool: "source-map",

	entry: "./src/index",
	output: {
		path: path.join(__dirname, "/dist"),
		filename: "bundle.js",
	},

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src/"),
		},
		extensions: [".ts", ".tsx", ".js"],
	},

	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "awesome-typescript-loader",
					},
				],
			},
			{
				test: /\.(jpe?g|gif|png|svg|woff|tiff|wav|mp3)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "textures/",
						},
					},
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
		}),
	],

	// When importing a module whose path matches one of the following, just
	// assume a corresponding global variable exists and use that instead.
	// This is important because it allows us to avoid bundling all of our
	// dependencies, which allows browsers to cache those libraries between builds.
	externals: {},
};
