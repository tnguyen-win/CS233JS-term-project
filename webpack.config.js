const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = require("html-webpack-plugin");
const copyPlugin = require("copy-webpack-plugin");

module.exports = {
	mode: 'development',
	entry: {
		index: './src/js/index.js',
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: '[name].bundle.js',
		clean: true,
	},
	target: 'web',
	devServer: {
		static: "./src"
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/i,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /.s[ac]ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.(svg|eot|ttf|woff|woff2)$/i,
				type: "asset/resource",
			},
			{
				test: /\.(png|jpg|gif)$/i,
				type: "asset/resource",
			},
		],
	},
	plugins: [
		new htmlWebpackPlugin({
			template: path.resolve(__dirname, "./src/index.html"),
			chunks: ["index"],
			inject: "body",
			filename: "index.html",
		}),
		new copyPlugin({
			patterns: [
				{ from: path.resolve(__dirname, "src/components"), to: path.resolve(__dirname, "dist/components") },
				{ from: path.resolve(__dirname, "src/js/services"), to: path.resolve(__dirname, "dist/js/services") },
			],
		}),
	],
}
