const yargs = require('yargs');
const filtering = require('./filtering');
const Packager = require('./packager');
const state = require('./state');
const logger = require('./logger');

yargs.option('in', {
  alias: 'i',
  type: 'string',
  description: 'Input file defining which files to include. Each line must be a glob pattern. See https://github.com/micromatch/micromatch for glob patter support.',
  nargs: 1,
  default: 'whitelist.dat',
  require: true
}).option('out', {
  alias: 'o',
  type: 'string',
  description: 'Name of output file.',
  nargs: 1,
  require: true
}).option('dry-run', {
  type: 'boolean',
  description: 'Itterate over glob patterns and print included files. Will not write a compressed archve. Useful for checking glob matching.'
}).option('silent', {
  alias: 's',
  type: 'boolean',
  description: 'Silence extraneous output. Errors will still be written to stderr.'
}).strict();

async function main() {
  const args = yargs.argv;
  const cwd = process.cwd();
  state.args = args;
  state.cwd = cwd;

  const packager = new Packager();
  await filtering.findFiles(packager);
  await packager.finalize();
  logger.log('Done!');
}

main();