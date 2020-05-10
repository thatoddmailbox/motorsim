const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const path = require("path");

var mode = (process.env.NODE_ENV === "development" ? "development" : "production");

module.exports = {
	mode: mode,

	entry: "./src/main.ts",

	output: {
		path: __dirname + "/dist",
		filename: "bundle.[chunkhash].js",
		publicPath: ""
	},

	devServer: {
		contentBase: "./dist",
		port: 9802,
	},

	optimization: {
		minimizer: (mode == "production" ? [
			new TerserPlugin({
				test: /\.js(\?.*)?$/i
			}),
			new OptimizeCssAssetsPlugin({})
		] : []),
		splitChunks: {
			cacheGroups: {
				styles: {
					name: "styles",
					test: /\.css$/,
					chunks: "all",
					enforce: true
				}
			}
		}
	},

	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/
			},
			{
				test: /\.css?$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					"css-loader"
				],
			},
			{
				test: /\.styl?$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					"css-loader",
					"stylus-loader"
				],
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: "url-loader?limit=10000&mimetype=application/font-woff"
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: "file-loader"
			}
		],
	},

	plugins: [
		new CleanWebpackPlugin(),

		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// all options are optional
			filename: "[name].css",
			chunkFilename: "[id].css",
			ignoreOrder: false, // Enable to remove warnings about conflicting order
		}),
		new OptimizeCssAssetsPlugin({}),

		new CopyWebpackPlugin([
			{ from: "img", to: "img" }
		]),

		new HtmlWebpackPlugin({
			template: "base.ejs",
			title: "motorsim"
		})
	],

	resolve: {
		modules: [
			path.resolve("./src"),
			path.resolve("./node_modules"),
		]
	}
};