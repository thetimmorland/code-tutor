const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
  entry: ['babel-polyfill', './src/client/index.js'],
  stats: 'errors-only',
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  devServer: {
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:3000',
      '/socket': {
        ws: true,
        target: 'ws://localhost:3000',
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
    }),
  ],
};
