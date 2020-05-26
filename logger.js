const state = require('./state');

module.exports = {
  log(...args) {
    if (!state.args.silent) {
      console.log(...args);
    }
  },

  warn(...args) {
    console.warn(...args);
  },

  error(...args) {
    console.error(...args);
  },

  fatal(exitCode, ...args) {
    console.error(...args);
    process.exit(exitCode);
  },
};