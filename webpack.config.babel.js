import BXConfigComponent from './BXConfigComponent';
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'dev';
const isProd = nodeEnv === 'production';

const extractCSS = new ExtractTextPlugin({filename: 'style.css', disable: false, allChunks: true});

const plugins = [
	new webpack.optimize.CommonsChunkPlugin({
		name: './dist/vendor/main.lib.js',
		minChunks: Infinity,
		filename: './dist/vendor/main.lib.js'
	}),
	new webpack.DefinePlugin({
		'process.env': {NODE_ENV: JSON.stringify(nodeEnv)}
	}),
];

if (isProd) {
	plugins.push(
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				conditionals: true,
				unused: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				evaluate: true,
				if_return: true,
				join_vars: true,
			},
			output: {
				comments: false
			},
		}),
		extractCSS
	);
} else {
	plugins.push(
		// new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin()
	);
}

let mainConfig = {
	//devtool: isProd ? 'source-map' : 'cheap-module-source-map',
	context: path.resolve(__dirname, '..'),
	entry: {
		'./dist/vendor/main.lib.js': [
			// 'react',
			// 'react-dom',
			'redux',
			'react-redux',
			'react-router',
			'is_js',
			'sweetalert'
		],
	},
	output: {
		path: path.resolve(__dirname, '..'),
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]'
					}
				}]
			},
			{
				test: /\.scss$/,
				use: isProd ?
					extractCSS.extract({
						fallbackLoader: 'style-loader',
						loader: ['css-loader', 'sass-loader'],
					}) :
					['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
						presets: ['es2015','latest','react'],
						plugins: [
							path.resolve(__dirname, 'node_modules', 'babel-plugin-transform-runtime'),
							path.resolve(__dirname, 'node_modules', 'babel-plugin-transform-react-jsx-source'),
							path.resolve(__dirname, 'node_modules', 'babel-plugin-transform-react-jsx-self'),
						]
					}
				}],
			},
			{
				test: /\.(gif|png|jpg|jpeg\ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				use: 'file-loader'
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			}
		],
	},
	resolve: {
		extensions: ['.js', '.jsx'],
		modules: [
			path.join(__dirname, '..', 'modules', 'ab.tools', 'asset', 'js'),
			'node_modules'
		]
	},
	watch: true,
	watchOptions: {
		aggregateTimeout: 100
	},
	plugins: plugins,
};

const BXComponent = new BXConfigComponent();
// BXComponent.addComponent('test', {name: 'ab:test.cmp'});

mainConfig = BXComponent.mergeConfig(mainConfig, [
	'test'
]);

module.exports = mainConfig;