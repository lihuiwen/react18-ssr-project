const path = require('path');

const commonConfig = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../'),
      '@client': path.resolve(__dirname, '../client'),
      '@server': path.resolve(__dirname, '../server'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },

  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
  },
};

module.exports = commonConfig;
