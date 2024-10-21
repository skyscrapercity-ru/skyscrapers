const HtmlWebpackPlugin = require('html-webpack-plugin');
import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
  entry: './src/main.ts',
  mode: 'none',
  resolve: {
    extensions: ['.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};

export default config;