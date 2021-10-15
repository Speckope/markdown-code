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
      // Handle main js file
      build.onLoad({ filter: /(^index\.js$)/ }, (args: esbuild.OnLoadArgs) => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });

      // Caching. Runs for every file, if it's cached, it returns it.
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        // If we find some cached value, return it. Esbuild will then not run other filters.
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (cachedResult) {
          return cachedResult;
        }
      });

      //Handle CSS files
      build.onLoad({ filter: /.css$/ }, async (args: esbuild.OnLoadArgs) => {
        const { data, request }: { data: string; request: any } =
          await axios.get(args.path);

        const escaped = data
          // Find all the new line characters, replace them with an empty string
          .replace(/\n/g, '')
          // Escape all single and double quotes
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents = `
              const style = document.createElement('style');
              style.innerText = '${escaped}';
              document.head.appendChild(style)
          `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // Store response in cache
        await fileCache.setItem(args.path, result);

        return result;
      });

      // Handle nested imports jss files
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const { data, request }: { data: string; request: any } =
          await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // Store response in cache
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
