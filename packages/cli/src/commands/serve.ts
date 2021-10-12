import { Command } from 'commander';
import { serve } from 'local-api';
import path from 'path';

export const serveCommand = new Command()
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
  .action((filename = 'notebook.js', options: { port: string }) => {
    // .dirname(filename) gives us a directory specified in a string (like b from b/a.js),
    // If no directory is provided, it returns an empty string
    const dir = path.join(process.cwd(), path.dirname(filename));
    // basename(filename) gives us an actual filename. (without a relative path)
    console.log(path.basename(filename));
    serve(parseInt(options.port), path.basename(filename), dir);
  });
