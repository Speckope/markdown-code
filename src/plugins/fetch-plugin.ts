import esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode,
          };
        }

        // Chack to see if we have already fetched this file
        // and if it's already in the cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        // If it is, return it immediately
        if (cachedResult) {
          return cachedResult;
        }

        const { data, request }: { data: string; request: any } =
          await axios.get(args.path);

        const fileType = args.path.match(/.css$/) ? 'css' : 'jsx';

        const escaped = data
          // Find all the new line characters, replace them with an empty string
          .replace(/\n/g, '')
          // Escape all single and double quotes
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents =
          fileType === 'css'
            ? `
        
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style)

        `
            : data;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // Store response in cache
        // await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
