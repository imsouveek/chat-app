/*
  This file is intended for use as webpack configuration for a production server.
  Hot reloading is not required and we try to apply compression where possible.
  Note that we have an explicit build script but that is for generating stats only.
  The server will automatically compile code when it starts as well
*/
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// Have to export webpack settings object
module.exports = {

  // "name" is required if we want to compile multiple files
  name: "client",

  // Start points for the application
  entry: {
    index: [
      path.resolve(__dirname, '../../src/client/assets/js/index.js'),
    ],
    chat: [
      path.resolve(__dirname, '../../src/client/assets/js/chat.js'),
    ]
  },

  // Enable production mode
  mode: 'production',

  /*
    Output parameters. Define the output directory, the URL relative path and
    target file name
  */
  output: {
    path: path.resolve(__dirname, '../../dist'),
    publicPath: '/',
    filename: '[name]-bundle.js'
  },

  // Add all the loaders
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
        followed by html-loader. We can change the loader for pug here but
        there is no need
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
        files. This is useful in production because the extracted files can then
        be passed to optimize-css-assets-webpack-plugin to minify and optimize
        the css
      */
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'sass-loader'
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
          name: '[name].[ext]',
          esModule: false,
        }
      }]
    }]
  },
  plugins: [

    // Delete output directory before each build
    new CleanWebpackPlugin(),

    /*
      Special control for source maps. "fileContext" sets root directory, "filename" sets
      output directory and file name, and "publicPath" sets path prefix to be used to
      reach sourcemaps
    */
    new webpack.SourceMapDevToolPlugin({
      publicPath: 'http://localhost:3000/',
      filename: 'sourcemaps/[name].map',
      fileContext: 'dist',
    }),

    // Extract css into separate files
    new MiniCssExtractPlugin(),

    // Optimize and minimize the extracted css
    new OptimizeCssAssetsWebpackPlugin(),

    // Provide template for index.html
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../src/client/templates/views/chat.pug'),
      filename: 'chat.html',
      excludeChunks: ['index'],
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../src/client/templates/views/index.pug'),
      filename: 'index.html',
      excludeChunks: ['chat'],
    }),

    // Create a compressed file using brotli compression algorithm
    new CompressionWebpackPlugin({
      algorithm: 'brotliCompress',
      filename: '[path].br[query]'
    }),

    // Create a compressed file using gzip compression algorithm
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      filename: '[path].gz[query]'
    }),

    /*
      Load only en-us locale for moment to limit build sizes. This can also
      be done using moment-locales-webpack-plugin, but there is no difference
      in size of build by using the two methods
    */
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-us/)
  ],

  // Source maps controlled through plugin
  devtool: false,

  /*
    Optimization settings - Mainly want split chunks and minify
  */
  optimization: {

    /*
      Minimization settings: Set minimization on and use Terser plugin
      to minimize js (not using UglifyJS because project uses ES6 code)
    */
    minimize: true,
    minimizer: [
      new TerserPlugin({
        sourceMap: true
      })
    ],

    /*
      Chunk splitting: Allow splitting of chunks and moving dependencies to
      vendors chunk
    */
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
}