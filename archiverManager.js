const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const state = require('./state');
const logger = require('./logger');

async function loadGlobs() {
  const whitelistFile = path.resolve(state.cwd, state.args.in);

  try {
    const whitelistContents = await fs.promises.readFile(whitelistFile);
    return whitelistContents.toString().split(/\r?\n/)
  } catch (ex) {
    logger.fatal(1, `The file [${whitelistFile}] does not exist. Please create this file and load it with globs to indicate which files to include for upload.`, ex);
  }
}

module.exports = function() {
  return new Promise((resolve, reject) => {
    loadGlobs().then(globs => {
      const archive = archiver(state.args.zip ? 'zip' : 'tar');
      const output = fs.createWriteStream(path.resolve(state.cwd, state.args.out));

      output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        resolve();
      });

      archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
        } else {
          console.warn(err);
        }
      });

      archive.on('error', function(err) {
        console.error(err);
        reject(err);
      });

      archive.pipe(output);

      globs.forEach(glob => {
        archive.glob(glob, {cwd: state.cwd});
      });

      archive.finalize();
    });
  });
}
