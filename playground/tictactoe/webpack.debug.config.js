var webpack = require('webpack');

var path = require('path');
var fs = require('fs');

module.exports = {
	entry: {
		client: "./playground/tictactoe/src/debug/debug.ts"
	},
	output: {
		filename: "debug.js",
		path: __dirname + "/dist/"
	},

	// Enable sourcemaps for debugging webpack's output.
	devtool: "source-map",

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: "source-map-loader"
			},
			{
				test: /\.tsx?$/,
				loader: "awesome-typescript-loader"
			}
		]
	}
};