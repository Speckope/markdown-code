import express from 'express';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createCellsRouter } from './routes/cells';

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  // This comes first, because we want to attempt making use of route handlers
  // before we use our proxy middleware
  app.use(createCellsRouter(filename, dir));

  if (useProxy) {
    // Redirect requests that are not about getting posting files to react.
    // Now when we go to localhost our serve is running on we get react app!
    // We are accessing our local api, but request we make get proxied to our CRA
    // we then get development assets and send them back over to the browser!
    // This is for when we are doing active development to connect to our CRA server and
    // simulate what will happen in production when we get production files! NICE!
    app.use(
      createProxyMiddleware({
        target: 'http://localhost:3000',
        // enable web socket support
        // CRA uses web sockets by default to tell the browser whenever
        // some development file is changed, bc we might have changed this file inside our editor.
        ws: true,
        // No logs
        logLevel: 'silent',
      })
    );
  } else {
    // This is required, becouse with lerna a symlink is created to our package, and
    // express.static doesn't resolve symlinks
    const packagePath = require.resolve('local-client/build/index.html');
    app.use(express.static(path.dirname(packagePath)));
  }

  // We pass resolve as a callback function, then listen to the error and rejec if
  // it's emitted
  // We wrap starting server inside a custom promise.
  // Now serve returns a promise and we need to await it in our serve.ts!
  // This way error will be properly catched by try catch block inside serve.ts
  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
};
