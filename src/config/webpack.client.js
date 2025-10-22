const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

// HMR entry points for development
const hmrEntry = isDevelopment
  ? ['webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr&reload=true']
  : [];

const clientConfig = merge(commonConfig, {
  name: 'client',
  target: 'web',

  entry: {
    main: [...hmrEntry, path.resolve(__dirname, '../client/index.tsx')],
  },

  output: {
    path: path.resolve(__dirname, '../../dist/client'),
    filename: 'bundle.js',
    // Use absolute URL in development to point to HMR server
    // This ensures hot-update.json requests go to the correct server
    publicPath: isDevelopment
      ? 'http://localhost:3001/static/'
      : '/static/',
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../public/index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
    // Add HMR plugin in development mode
    ...(isDevelopment ? [new webpack.HotModuleReplacementPlugin()] : []),
  ],

  devServer: {
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: true,
    compress: true,
  },

  devtool: isProduction ? 'source-map' : 'eval-source-map',
});

module.exports = clientConfig;
