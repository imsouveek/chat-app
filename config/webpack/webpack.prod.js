const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  name: 'client',
  entry: {
    index: [
      path.resolve(__dirname, '../../src/client/assets/js/index.js')
    ]
  },
  mode: 'production',
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
        MiniCssExtractPlugin.loader,
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
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      filename: '[path].gz[query]'
    }),
    new CompressionWebpackPlugin({
      algorithm: 'brotliCompress',
      filename: '[path].br[query]'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../../src/client/templates/views/index.pug'),
      chunks: ['index']
    })
  ],
  devtool: 'source-map',
  optimization: {
    /* Apply uglifyJs minimizer */
    // minimizer: [
    //   new UglifyJsPlugin()
    // ],
    /*
      Optimization with splitChunksPlugin
    */
    splitChunks: {
      chunks: 'all',
      minChunks: 2,
      cacheGroups: {
        vendors: {
          name: "vendor",
          chunks: "initial",
          minChunks: 2,

        }
      }
    }
  },
}