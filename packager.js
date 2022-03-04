const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const state = require('./state');
const logger = require('./logger');

module.exports = class Packager {
  constructor() {
    if (state.args.dryRun) {
      return;
    }

    this._archive = archiver(state.args.zip ? 'zip' : 'tar');
    this._output = fs.createWriteStream(path.resolve(state.cwd, state.args.out));

    this._archive.on('warning', function(err) {
      if (err.code === 'ENOENT') {
      } else {
        console.warn(err);
      }
    });

    this._archive.on('error', function(err) {
      console.error(err);
    });

    this._output.on('close', function() {
    });

    this._archive.pipe(this._output);
  };

  async add(file) {
    let relativeFile = file.indexOf(state.cwd) === 0 ? file.substring(state.cwd.length) : file;
    if(relativeFile[0] === path.sep) {
      relativeFile = relativeFile.substring(1);
    }
    const rename = state.config.rename[relativeFile];
    logger.log(`  Adding [${relativeFile}${rename ? ` => ${rename}` : ''}]`);

    if (state.args.dryRun) {
      return;
    }

    try {
      const fileContents = await fs.promises.readFile(file);
      this._archive.append(fileContents, { name: rename || relativeFile });
    } catch (ex) {
      logger.fatal(1, `Error adding file [${relativeFile}] to tar.`, ex);
    }
  };

  finalize() {
    if (state.args.dryRun) {
      return;
    }

    this._archive.finalize();
  };
}