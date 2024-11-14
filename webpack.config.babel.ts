import { BuildingsDataPlugin, DiccPatchPlugin, DiccCompilerPlugin } from './webpack.plugins.babel';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { type Configuration } from 'webpack'
import "webpack-dev-server";

const patch = new DiccPatchPlugin();
patch.apply();

const config: Configuration = {
  entry: ['./src/main.ts'],
  mode: 'none',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  plugins: [
    new BuildingsDataPlugin(),
    new DiccCompilerPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    watchFiles: 'src',
    port: 9000
  },
};

export default config;