"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveCommand = void 0;
var commander_1 = require("commander");
var local_api_1 = require("local-api");
var path_1 = __importDefault(require("path"));
exports.serveCommand = new commander_1.Command()
    // Name of the command
    // Square brackets indicate it's an optional value
    .command('serve [filename]')
    // Description when we put --help
    .description('Open a file for editing')
    // Options that may ne passed, second argument is a description, third is a default port
    // Angle brackets indicate it's a required value (if user provides -p or --p options,
    // he must also provice port number)
    .option('-p --port <number>', 'port to run server on', '4005')
    // We take arguments provided into action.
    // If user does not provide filename, we make notebook.js a default value.
    // Second argument is an object with all the different options we provided
    .action(function (filename, options) {
    if (filename === void 0) { filename = 'notebook.js'; }
    // .dirname(filename) gives us a directory specified in a string (like b from b/a.js),
    // If no directory is provided, it returns an empty string
    var dir = path_1.default.join(process.cwd(), path_1.default.dirname(filename));
    // basename(filename) gives us an actual filename. (without a relative path)
    console.log(path_1.default.basename(filename));
    (0, local_api_1.serve)(parseInt(options.port), path_1.default.basename(filename), dir);
});
