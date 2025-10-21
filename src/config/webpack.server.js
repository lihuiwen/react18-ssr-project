const path = require('path');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const commonConfig = require('./webpack.common');

const serverConfig = merge(commonConfig, {
  name: 'server',
  target: 'node',

  entry: {
    server: path.resolve(__dirname, '../server/index.ts'),
  },

  output: {
    path: path.resolve(__dirname, '../../dist/server'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    clean: true,
  },

  externals: [nodeExternals()],

  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
});

module.exports = serverConfig;
