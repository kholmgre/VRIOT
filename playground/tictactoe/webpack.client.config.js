
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = {
	entry: {
		client: "./playground/tictactoe/src/client/main.ts"
	},
	output: {
		filename: "[name].js",
		path: __dirname + "/dist"
	},

	// Enable sourcemaps for debugging webpack's output.
	devtool: "source-map",

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
	},

	plugins: [
		new SWPrecacheWebpackPlugin ({
			cacheId: "tictactoe",
			filename: "sw.js",
			maximumFileSizeToCacheInBytes: 8388608,
			minify: true,
			//verbose: true,
			staticFileGlobs: [
				"playground/tictactoe/dist/aframe-ar.js",
				"playground/tictactoe/dist/aframe.min.js",
				"playground/tictactoe/dist/client.js",
				"playground/tictactoe/dist/server.js",
				"playground/tictactoe/assets/audio/**/*.wav",
				"playground/tictactoe/assets/icons/**/*",
				"playground/tictactoe/assets/fonts/**/*",
				"playground/tictactoe/assets/markers/**/*",
				"playground/tictactoe/assets/models/**/*.{obj,mtl}",
				"playground/tictactoe/assets/textures/**/*.{jpg,png}"
			],
			runtimeCaching: [{
				handler: "cacheFirst",
				urlPattern: /[.]{wav,mp3,mp4}$/
			}],
		})
	],
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