import * as esbuild from 'esbuild-wasm';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

let service: esbuild.Service;

const bundleFunction = async (rawCode: string) => {
  // Initialize esbuild
  // It has to be ionitialized only once, so we assign it to an outer variable
  // and check if it's defined.
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  }

  // Run the bundle
  const result = await service.build({
    // It says to esbuild to bundle index.js file
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    // We pass input into our plugin!
    plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
    define: {
      // This will replace process.env.NODE_ENV with "production" whenever it finds it
      'process.env.NODE_ENV': '"production"',
      global: 'window',
    },
  });

  // Send back bundled code
  return result.outputFiles[0].text;
};

export default bundleFunction;
