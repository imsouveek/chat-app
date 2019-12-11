import { resolve } from 'path';
import express from 'express';
import configDevClient, { devServer } from '../../config/webpack/webpack.dev';
import webpack from 'webpack';

// Create the express server-side app
const app = express();
console.log(process.env.NODE_ENV);

// Determine if we are running in production mode
const isProd = (process.env.NODE_ENV === 'production');

// Access control logic for sourcemaps can go here if needed
app.use('/sourcemaps/*', (req, res, next) => {
  console.log('Sourcemap accessed');
  next();
});

if (!isProd) {

  // Development server

  // Compile development webpack config
  const compiler = webpack([configDevClient]).compilers[0];

  // Enable webpack dev middleware
  const WebpackDevMiddleware = require('webpack-dev-middleware');
  const webpackDevMw = WebpackDevMiddleware(compiler, devServer);
  app.use(webpackDevMw);

  // Enable webpack hot middleware
  const WebpackHotMiddleware = require('webpack-hot-middleware');
  const webpackHotMw = WebpackHotMiddleware(compiler);
  app.use(webpackHotMw);

  // Serve static files from dist
  app.use(express.static(resolve(__dirname, '../../dist')));
} else {

  // Production server

  // Use express-static-gzip to serve compressed files
  const expressStaticGzip = require('express-static-gzip');

  // Serve compressed files, enable brotli compression and prefer brotli
  app.use(expressStaticGzip(resolve(__dirname, '../../dist'), {
    enableBrotli: true,
    orderPreference: ['br']
  }));
}

// Export the app
export default app;