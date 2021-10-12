"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
var serve = function (port, filename, dir) {
    console.log('Serving on: ', port);
    console.log('Saving/fetching cells from: ', filename);
    console.log('That file is in directory ', dir);
};
exports.serve = serve;
