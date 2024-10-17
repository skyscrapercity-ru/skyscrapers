const HtmlWebpackPlugin = require('html-webpack-plugin');
import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
  entry: './src/main.ts',
  mode: 'none',
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.ts$/,
        exclude: /node_modules/,
        include: "/src"
      }
    ]
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};

export default config;