const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const tar = require('tar-stream');
const state = require('./state');
const logger = require('./logger');

module.exports = class Packager {
  constructor() {
    this._pack = tar.pack();
  };

  _compress() {
    return new Promise((resolve, reject) => {
      const destination = fs.createWriteStream(state.args.out);
      const gz = new zlib.Gzip();
      destination.on('close', () => resolve());
      try {
        this._pack.pipe(gz).pipe(destination);
      } catch (ex) {
        reject(ex);
      }
    });
  };

  async add(file) {
    let relativeFile = file.indexOf(state.cwd) === 0 ? file.substring(state.cwd.length) : file;
    if(relativeFile[0] === path.sep) {
      relativeFile = relativeFile.substring(1);
    }
    logger.log(`  Adding [${relativeFile}]`);

    if (state.args.dryRun) {
      return;
    }

    try {
      const fileContents = await fs.promises.readFile(file);
      this._pack.entry({ name: relativeFile }, fileContents);
    } catch (ex) {
      logger.fatal(1, `Error adding file [${relativeFile}] to tar.`, ex);
    }
  };

  async finalize() {
    if (state.args.dryRun) {
      return;
    }

    logger.log('Compressing...');
    try {
      this._pack.finalize();
      if(state.args.out) {
        await this._compress();
      }
    } catch (ex) {
      logger.fatal(1, `Error while compressing.`, ex);
    }
  };
}