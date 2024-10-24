import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from "copy-webpack-plugin";
import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
  entry: './src/main.ts',
  mode: 'none',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{
        test: /\.ts/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
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
    }),
    new CopyPlugin({
      patterns: [
        { from: "buildings.txt", to: "buildings.txt" },
      ]
    })
  ],
  devServer: {
    watchFiles: path.join(__dirname, 'src'),
    port: 9000,
  },
};

export default config;