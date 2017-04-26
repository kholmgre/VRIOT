module.exports = {
	target: 'node',
	entry: {
		servertests: "./playground/tictactoe/src/server/tests/server.tests.ts"
	},
	output: {
		filename: "[name].js",
		path: __dirname + "/test/"
	},

	// Enable sourcemaps for debugging webpack's output.
	// devtool: "source-map",

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".ts"]
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
	},
	externals: nodeModules
};