const fs = require('fs');
const path = require('path');
const node_modules = fs.readdirSync('node_modules').filter(x => x !== '.bin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

let appConfig = {};
try {
  const configData = fs.readFileSync('./appconfig.json');
} catch (e) {
  console.warn('firebase configuration not found. copy appconfig.dist.json to appconfig.json an apply your personal settings', e);  
}

module.exports = [{
  mode: 'development',
  target: 'web',
  entry: './src/ui/client.tsx',
  output: {
    path: __dirname + '/dist',
    filename: 'client.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
	use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader"
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: [ 'url-loader?limit=10000', 'img-loader?minimize' ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.webpack.js', '.web.js', '.js'],
    // alias: {
    //   "xreact": path.resolve('react-compat.js'),
    //   "xreact-dom": "preact-compat",
    //   'xcreate-react-class': 'preact-compat/lib/create-react-class',
    //   'xreact-dom-factories': 'preact-compat/lib/react-dom-factories'
    // }
  },
  plugins: [
     new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    // new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
       template: './src/ui/index.ejs'
    }),
    new webpack.EnvironmentPlugin(
      { 
        ...appConfig, 
        PACKED: 'true' 
      })
  ]
}
];
