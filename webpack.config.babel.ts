import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { type Configuration } from 'webpack'
import "webpack-dev-server";
import fs from 'fs';
import crypto from 'crypto';

class BuildingsDataWebpackPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('BuildingsDataWebpackPlugin', compilation => {
      compilation.hooks.processAssets.tap({
          name: 'BuildingsDataWebpackPlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS,
        }, assets => {
          let assetName = Object.keys(assets).find(fileName => fileName.startsWith('main.') && fileName.endsWith('.js'));
          if (!assetName) throw new Error('main.js is not found');
          const assetInfo = compilation.assetsInfo.get(assetName);
          if (!assetInfo) throw new Error('main.js info is not found');
          const asset = assets[assetName];
          if (!asset) throw new Error('main.js asset is not found');

          const modified = this.getBuildingsMap() + asset.source();
          const hash = assetInfo.contenthash;
          assetInfo.contenthash = crypto.createHash('md5').update(modified).digest('hex');
          compilation.updateAsset(assetName, { source: () => modified, size: () => modified.length });
          compilation.renameAsset(assetName, assetName.replace(hash, assetInfo.contenthash));
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
        test: /\.ts$/,
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
    new BuildingsDataWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    watchFiles: path.join(__dirname, 'src'),
    port: 9000,
  },
};

export default config;