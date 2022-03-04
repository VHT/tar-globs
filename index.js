#!/usr/bin/env node

const path = require('path');
const yargs = require('yargs');
const filtering = require('./filtering');
const Packager = require('./packager');
const state = require('./state');
const logger = require('./logger');
const config = require('./config');

yargs.option('in', {
  alias: 'i',
  type: 'string',
  description: 'Input file defining which files to include. Path is relative to --cwd. Each line must be a glob pattern. See https://github.com/micromatch/micromatch for glob patter support.',
  nargs: 1,
  require: true
}).option('out', {
  alias: 'o',
  type: 'string',
  description: 'Name of output file. Path is relative to --cwd.',
  nargs: 1,
  require: true
}).option('zip', {
  alias: 'z',
  type: 'boolean',
  description: 'Output .zip instead of .tar.gz',
}).option('dry-run', {
  type: 'boolean',
  description: 'Itterate over glob patterns and print included files. Will not write a compressed archve. Useful for checking glob matching.'
}).option('silent', {
  alias: 's',
  type: 'boolean',
  description: 'Silence extraneous output. Errors will still be written to stderr.',
}).option('cwd', {
  alias: 'c',
  type: 'string',
  description: 'Path to use as the root to scan for files to archive. Default is the node process.cwd(). In and Out file paths are relative to this path.',
  nargs: 1,
}).strict();

async function main() {
  const args = yargs.argv;
  const cwd = args.cwd || '.';
  state.args = args;
  state.cwd = path.resolve(process.cwd(), cwd);
  state.config = config.loadConfig();

  const packager = new Packager();
  await filtering.findFiles(packager);
  await packager.finalize();
  logger.log('Done!');
}

main();