const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');

const isProduction = process.env.NODE_ENV === 'production';

const clientConfig = merge(commonConfig, {
  name: 'client',
  target: 'web',

  entry: {
    main: path.resolve(__dirname, '../client/index.tsx'),
  },

  output: {
    path: path.resolve(__dirname, '../../dist/client'),
    filename: 'bundle.js',
    // Production: /static/ (for SSR server)
    // Development: / (for webpack-dev-server)
    publicPath: isProduction ? '/static/' : '/',
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../public/index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
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
