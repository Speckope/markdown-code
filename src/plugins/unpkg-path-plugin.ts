import axios from 'axios';
import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // onResolve step figures out, where the index.js file is stored
      // By defining it, we change the default behavior of esbuild and change
      // We return the path ourselves
      // WE can control when onResolve and onLoad are executed with filter: ...
      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {
        console.log('onResolve', args);
        // When we return namespace, we can say in a next function that we want a function to pplay ony to
        // the specified namespace. E.g. byy defining second argument in onLoad namespace: 'a'

        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        // If there is an import inside our module
        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            // Importer is the file in which a module is, file which requires other module.
            // .resolveDir is what we passed in a last onLoad object!
            path: new URL(
              args.path,
              'https://unpkg.com' + args.resolveDir + '/'
            ).href,
          };
        }

        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });

      // onLoad takes the path from onResolve and attempts to load this file up
      // By defining it here, we change the default bahaviour of esbuild
      // (which is to read it directly from the filesystem)
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        console.log('onLoad', args);

        // We return the object imnmediatlely it is trying to load!
        // If esbuild is trying to load up index.js, don't let it load from the filesystem
        // Instead we load it for esbuild!
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import message from 'nested-test-pkg';
              console.log(message);
            `,
          };
          // This runs when esbuild is trying to load up contents of a file that's not index.js
          // So when there is an import statement!
          // Don't try to access the filesystem, but load what we return.
        }
        const { data, request } = await axios.get(args.path);
        return {
          loader: 'jsx',
          contents: data,
          // This gets us the directory of one above file(folder)
          resolveDir: new URL('./', request.responseURL).pathname,
        };
      });
    },
  };
};
