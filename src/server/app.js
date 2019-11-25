import { resolve } from 'path';
import express from 'express';
import configDevClient, { devServer } from '../../config/webpack/webpack.dev';
import configProdClient from '../../config/webpack/webpack.prod';
import webpack from 'webpack';

const app = express();

const isProd = (process.env.NODE_ENV === 'production');

if (!isProd) {
  const compiler = webpack([configDevClient]).compilers[0];

  const WebpackDevMiddleware = require('webpack-dev-middleware');
  const webpackDevMw = WebpackDevMiddleware(compiler, devServer);
  app.use(webpackDevMw);

  const WebpackHotMiddleware = require('webpack-hot-middleware');
  const webpackHotMw = WebpackHotMiddleware(compiler);
  app.use(webpackHotMw);

  app.use(express.static(resolve(__dirname, '../../dist')));
} else {
  webpack([configProdClient]).run((err, stats) => {
    const expressStaticGzip = require('express-static-gzip');

    app.use(expressStaticGzip(resolve(__dirname, '../../dist'), {
      enableBrotli: true,
      orderPreference: ['br']
    }));
  });
}

console.log("Server started");
export default app;