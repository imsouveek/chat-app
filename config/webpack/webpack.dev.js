/*
  This file is intended for use as webpack configuration for a development server.
  The project setup is done such that all server file changes trigger a restart of
  the server whereas all client changes should be hot-reloaded. Note that we don't
  want to provide an explicit script for building the code - the server code
  automatically does that
*/
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Have to export webpack settings object
module.exports = {

  // "name" is required if we want to compile multiple files
  name: "client",

  /*
    Start point for the application. Note that dev config should include
    hot reload script. Also, main.js includes css and template which ensures
    hot reloading of css and templates - wihout that, we have to manually
    include each css and template in these settings
  */
  entry: {
    index: [
      'webpack-hot-middleware/client?reload=true',
      path.resolve(__dirname, '../../src/client/assets/js/main.js'),
    ]
  },

  // Development mode
  mode: 'development',

  /*
    Output parameters. Define the output directory, the URL relative path and
    target file name
  */
  output: {
    path: path.resolve(__dirname, '../../dist'),
    publicPath: '/',
    filename: '[name]-bundle.js'
  },

  /* Add all the loaders */
  module: {
    rules: [{

      /*
        Javascript - this is loaded using babel-loader and so, babelrc
        is required. Also note: removing node_modules files here
      */
      test: /\.js[x]?$/,
      use: [
        'babel-loader'
      ],
      exclude: /node_module/
    }, {

      /*
        Pug - we are loading this using pug-plain-loader (built for VueJS)
        followed by html-loader. Per observation, this retains hot-reload
        functionality for pug files including inherited / included files
      */
      test: /\.pug$/,
      use: [
        {
          loader: 'html-loader',
          options: {
            attrs: [
              'img:src',
              'link:href'
            ]
          }
        },
        'pug-plain-loader'
      ]
    }, {

      /*
        The plugin mini-css-extract-plugin will extract all css into separate
        files. While that is strictly not required for development, we can use
        mini-css-extract-plugin because its loader already supports hot reloading
      */
      test: /\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: true,
            reloadAll: true
          }
        },
        'css-loader'
      ]
    }, {

      /*
        Load images using file loader
      */
      test: /\.(jpg|png|gif)$/,
      use: [{
        loader: 'file-loader',
        options: {
          outputPath: 'images',
          name: '[name].[ext]'
        }
      }]
    }]
  },
  plugins: [

    // Delete output directory before each build
    new CleanWebpackPlugin(),

    // Enable source maps
    new webpack.SourceMapDevToolPlugin({}),

    // Enable hot reload of changes
    new webpack.HotModuleReplacementPlugin(),

    // Extract css into separate files
    new MiniCssExtractPlugin(),

    // Provide template for index.html
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../src/client/templates/views/index.pug'),
      filename: 'index.html',
    }),
  ],

  // Source maps controlled through plugin
  devtool: false,

  /*
    Dev Server setup. Note that "contentBase" provides directory to serve from,
    "hot" enables hot reloading, "overlay" indicates that errors are displayed as an
    overlay and "writeToDisk" compiles assets and dumpts to dist folder. Without
    writeToDisk, express will not be able to server devServer as static middleware
    won't find any files to serve
  */
  devServer: {
    contentBase: path.resolve(__dirname, '../../dist'),
    hot: true,
    overlay: true,
    writeToDisk: true,
  }
}