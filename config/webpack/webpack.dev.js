/*
  Dev server setup with Webpack. This supports hot-reloading for
  any changes to the application
*/
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  /*
    Name of the configuration. This helps with doing compilation of the
    code with express
  */
  name: "client",

  /*
    Entry point for the code compilation. In dev server, we always start
    with webpack-hot-middleware for hot-reloading
  */
  entry: {
    /*
      This is the entry point for index.html. Note that the pug file is added
      to enable hot-reloading
    */
    index: [
      'webpack-hot-middleware/client?reload=true',
      path.resolve(__dirname, '../../src/client/assets/js/index.js')
    ]
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../../dist'),
    publicPath: '/',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.js[x]?$/,
      use: ['babel-loader'],
      exclude: /node_modules/
    }, {
      test: /\.pug$/,
      use:[
        'html-loader',
        'pug-plain-loader'
      ]
    }, {
      test: /\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: true,
            reloadAll: true,
          }
        },
        "css-loader"
      ]
    }, {
      test: /\.(jpg|png)$/,
      use:[{
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "images"
        }
      }]
    }
  ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../../src/client/templates/views/index.pug'),
      chunks: ['index']
    })
  ],
  devtool: 'inline-source-map',
  /* Devserver settings */
  devServer: {
    contentBase: path.resolve(__dirname, '../../dist'),
    hot: true,
    overlay: true,
    writeToDisk: true
  }
}