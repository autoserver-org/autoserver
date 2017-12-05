'use strict';

const { startPerf, stopPerf, logPerfEvent } = require('../perf');

// Monitor startup time
const startStartupPerf = function () {
  const startupPerf = startPerf('startup');
  return { startupPerf };
};

const stopStartupPerf = function ({ startupPerf, measures }) {
  const startupPerfA = stopPerf(startupPerf);
  const measuresA = [startupPerfA, ...measures];
  return { measures: measuresA };
};

// Emit "perf" event with startup performance
const reportStartupPerf = function ({ schema, measures }) {
  return logPerfEvent({ phase: 'startup', schema, measures });
};

module.exports = {
  startStartupPerf,
  stopStartupPerf,
  reportStartupPerf,
};
