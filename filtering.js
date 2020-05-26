const fs = require('fs');
const path = require('path');
const micromatch = require('micromatch');
const state = require('./state');
const logger = require('./logger');

async function loadWhitelist() {
  const whitelistFile = path.join(state.cwd, state.args.in);

  try {
    const exclusions = [];
    const inclusions = [];
    const whitelistContents = await fs.promises.readFile(whitelistFile);
    whitelistContents.toString()
      .split(/\r?\n/)
      .forEach(x => {
        if (x[0] === '!') {
          exclusions.push(path.join(state.cwd, x.substring(1)));
        } else {
          inclusions.push(path.join(state.cwd, x));
        }
      })
    return [exclusions, inclusions];
  } catch (ex) {
    logger.fatal(1, `The file [${whitelistFile}] does not exist. Please create this file and load it with globs to indicate which files to include for upload.`, ex);
  }
}

async function filterFile(file, exclusions, inclusions, packager) {
  const stat = await fs.promises.stat(file);
  if((await stat).isFile()) {
    if(!micromatch.isMatch(file, exclusions) && micromatch.isMatch(file, inclusions)) {
      await packager.add(file);
    }
  } else {
    for (const f of await fs.promises.readdir(file)) {
      await filterFile(path.join(file, f), exclusions, inclusions, packager);
    }
  }
}

async function loadFilesToArchive(exclusions, inclusions, packager) {
  for (const f of await fs.promises.readdir(state.cwd)) {
    await filterFile(path.join(state.cwd, f), exclusions, inclusions, packager)
  }
}

module.exports = {
  async findFiles(packager) {
    try {
      logger.log(`Gathering files in [${state.cwd}]...`);
      const [exclusions, inclusions] = await loadWhitelist();
      await loadFilesToArchive(exclusions, inclusions, packager);
    } catch (ex) {
      logger.fatal(1, `Error while locating files.`, ex);
    }
  }
}