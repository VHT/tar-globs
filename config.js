const path = require('path');
const state = require('./state');

function loadConfig() {
  const configFile = path.join(state.cwd, state.args.in);

  try {
    const exclusions = [];
    const inclusions = [];
    const config = require(configFile);
    (config.globs || []).forEach(x => {
      if (x[0] === '!') {
        exclusions.push(path.join(state.cwd, x.substring(1)));
      } else {
        inclusions.push(path.join(state.cwd, x));
      }
    })
    return {
      exclusions,
      inclusions,
      rename: config.rename || {},
    };
  } catch (ex) {
    logger.fatal(1, `The file [${configFile}] does not exist. Please create this file and load it with globs to indicate which files to include for upload.`, ex);
  }
}

module.exports = {
  loadConfig,
};
