"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var http_proxy_middleware_1 = require("http-proxy-middleware");
var cells_1 = require("./routes/cells");
var serve = function (port, filename, dir, useProxy) {
    var app = (0, express_1.default)();
    if (useProxy) {
        // Redirect requests that are not about getting posting files to react.
        // Now when we go to localhost our serve is running on we get react app!
        // We are accessing our local api, but request we make get proxied to our CRA
        // we then get development assets and send them back over to the browser!
        // This is for when we are doing active development to connect to our CRA server and
        // simulate what will happen in production when we get production files! NICE!
        app.use((0, http_proxy_middleware_1.createProxyMiddleware)({
            target: 'http://localhost:3000',
            // enable web socket support
            // CRA uses web sockets by default to tell the browser whenever
            // some development file is changed, bc we might have changed this file inside our editor.
            ws: true,
            // No logs
            logLevel: 'silent',
        }));
    }
    else {
        // This is required, becouse with lerna a symlink is created to our package, and
        // express.static doesn't resolve symlinks
        var packagePath = require.resolve('local-client/build/index.html');
        app.use(express_1.default.static(path_1.default.dirname(packagePath)));
    }
    app.use((0, cells_1.createCellsRouter)(filename, __dirname));
    // We pass resolve as a callback function, then listen to the error and rejec if
    // it's emitted
    // We wrap starting server inside a custom promise.
    // Now serve returns a promise and we need to await it in our serve.ts!
    // This way error will be properly catched by try catch block inside serve.ts
    return new Promise(function (resolve, reject) {
        app.listen(port, resolve).on('error', reject);
    });
};
exports.serve = serve;
