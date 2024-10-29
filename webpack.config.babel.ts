import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { type Configuration } from 'webpack'
import "webpack-dev-server";
import fs from 'fs';

class BuildingsDataWebpackPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('BuildingsDataWebpackPlugin', compilation => {
      compilation.hooks.processAssets.tap({
          name: 'BuildingsDataWebpackPlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS,
        }, assets => {
          const assetName = Object.keys(assets).find(fileName => fileName.startsWith('main.') && fileName.endsWith('.js'));
          if (!assetName) throw new Error('main.js is not found');

          const asset = compilation.assets[assetName];
          const modified = this.getBuildingsMap() + asset.source();

          compilation.updateAsset(assetName, {
              source: () => modified,
              size: () => modified.length
          });
        }
      );
    });
  }

  getBuildingsMap() {
    const items = 'loadingItemsByWebpack';
    let code = `const loadedBuildingsByWebpack = new Map();\nlet ${items};\n`;
    fs.readdirSync('./data/').forEach(fileName => {
      const city = path.parse(fileName).name;
      code += `${items} = [];\nloadedBuildingsByWebpack.set('${city}', ${items});\n`;
      const content = fs.readFileSync(`./data/${fileName}`, 'utf8');
      content.split('\n').forEach(line => {
        if (line) {
          const parts = line.split('|');
          const name = parts[0];
          const floors = Number(parts[1]);
          const year = Number(parts[2]);
          code += `${items}.push({ name: '${name}', floors: ${floors}, year: ${year} });\n`;
        }
      });
    });
    return code;
  }
}

const config: Configuration = {
  entry: ['./src/main.ts'],
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
    new BuildingsDataWebpackPlugin()
  ],
  devServer: {
    watchFiles: path.join(__dirname, 'src'),
    port: 9000,
  },
};

export default config;