import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { exec } from 'child_process';

function getAsset(compilation: any) {
  let assetName = Object.keys(compilation.assets).find(fileName => fileName.startsWith('main.') && fileName.endsWith('.js'));
  if (!assetName) throw new Error('main.js is not found');
  const assetInfo = compilation.assetsInfo.get(assetName);
  if (!assetInfo) throw new Error('main.js info is not found');
  const asset = compilation.assets[assetName];
  if (!asset) throw new Error('main.js asset is not found');

  return { assetName, assetInfo, asset };
}

export class BuildingsDataPlugin {
    apply(compiler: any) {
      compiler.hooks.thisCompilation.tap('BuildingsDataPlugin', (compilation: any) => {
        compilation.hooks.processAssets.tap({
            name: 'BuildingsDataPlugin',
            stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS,
          }, (assets: any) => {
            const { assetName, assetInfo, asset } = getAsset(compilation);
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
  
export class DiccCompilerPlugin {
  private prevContentHash: string;

  apply(compiler: any) {
    compiler.hooks.thisCompilation.tap('DiccCompilerPlugin', (compilation: any) => {
        compilation.hooks.processAssets.tap({
          name: 'DiccCompilerPlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS,
        }, (assets: any) => {
          const { assetInfo } = getAsset(compilation);
          if (this.prevContentHash != assetInfo.contenthash) {
            this.prevContentHash = assetInfo.contenthash;
            const t = performance.now();
            exec('npm run di', (err, stdout, stderr) => {
              if (err) {
                console.error(`Error executing command: ${err}`);
                if (stdout) {
                  console.log(`stdout: ${stdout}`);
                }
                if (stderr) {
                  console.error(`stderr: ${err}`);
                }
                return;
              }
              
              console.log(`dicc compiled successfully in ${Math.round(performance.now() - t)} ms`);
            });
          }
        }
      );
    });
  }
}

export class DiccPatchPlugin {
  apply(compiler: any) {
    this.patchContainer();
    this.patchContainerContract();
    this.patchCompiler();
  }

  private patchContainer() {
    const filePath = './node_modules/dicc/dist/container.js';
    let js = fs.readFileSync(filePath, 'utf8');
    if (!js.startsWith('//patched')) {
      js = js.replace('const async_hooks_1 = require("async_hooks");', '');
      js = js.replace('new async_hooks_1.AsyncLocalStorage()', 'new LocalStorageMock()');
      js = "//patched\nclass LocalStorageMock { run(store, cb) {} getStore() {}}\n" + js;
      fs.writeFileSync(filePath, js);
    }
  }

  private patchContainerContract() {
    const filePath = './node_modules/dicc/dist/types.d.ts';
    let js = fs.readFileSync(filePath, 'utf8');
    if (!js.startsWith('//patched')) {
      js = "//patched\n" + js.replace('aliases?: string[];', 'deps?: any[];\naliases?: string[];');
      fs.writeFileSync(filePath, js);
    }
  }

  private patchCompiler() {
    const filePath = './node_modules/dicc-cli/dist/compiler.js';
    let js = fs.readFileSync(filePath, 'utf8');
    if (!js.startsWith('//patched')) {
      const pattern = "for (const hook of ['onCreate', 'onFork', 'onDestroy']) {";
      js = js.replace(pattern,
        `const argValues = this.compileArguments(factory.args, args && this.compileOverrides(writer, source, path, args));
            writer.write('deps: [');
            for (const arg of argValues) {
                writer.write(\`(di: any) => \${arg},\`);
            }
            writer.write(']');
            ${pattern}`);
      js = "//patched\n" + js;
      fs.writeFileSync(filePath, js);
    }
  }
}