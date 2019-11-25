const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  name: "client",
  entry: {
    index: [
      path.resolve(__dirname, '../../src/client/assets/js/main.js'),
    ]
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../../dist'),
    publicPath: '/',
    filename: '[name]-bundle.js'
  },
  module: {
    rules: [{
      test: /\.js[x]?$/,
      use: [
        'babel-loader'
      ],
      exclude: /node_module/
    }, {
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
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new OptimizeCssAssetsWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../src/client/templates/views/index.pug'),
      filename: 'index.html',
      chunks: ['index', 'vendor'],
    }),
    new CompressionWebpackPlugin({
      algorithm: 'brotliCompress',
      filename: '[path].br[query]'
    }),
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      filename: '[path].gz[query]'
    }),
  ],
  devtool: 'inline-source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          name: 'vendor',
          // minChunks: 2,
          chunks: 'all'
        }
      }
    }
  }
}