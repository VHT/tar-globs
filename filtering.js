const fs = require('fs');
const path = require('path');
const micromatch = require('micromatch');
const state = require('./state');
const logger = require('./logger');

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
      const {exclusions, inclusions} = state.config;
      await loadFilesToArchive(exclusions, inclusions, packager);
    } catch (ex) {
      logger.fatal(1, `Error while locating files.`, ex);
    }
  }
}