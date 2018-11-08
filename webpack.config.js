/* eslint-disable no-undef */
const path = require("path");

module.exports = {
	entry: ["babel-polyfill", "./static/js_src/entry"],
	output: {
		path: path.resolve(__dirname, "static/js"),
		filename: "main.bundle.js"
	},
	module: {
		rules: [
			{
				use: {
					loader: "babel-loader",
					options: {
						presets: ["env"]
					}
				}
			}
		]
	},
	stats: {
		colors: true
	},
	devtool: "source-map"
};