'use strict';


const { pick } = require('../utilities');


// Transform main options
const transformOptions = function ({ options }) {
  const perf = options.startupLog.perf.start('transform', 'options');
  if (options.loggerFilter && options.loggerFilter.constructor === Object) {
    transformLoggerFilters(options.loggerFilter);
  }
  perf.stop();
};

const transformLoggerFilters = function (filters) {
  for (const [name, filter] of Object.entries(filters)) {
    filters[name] = transformLoggerFilter(filter);
  }
};

const transformLoggerFilter = function (filter) {
  const isShortcut = filter instanceof Array &&
    filter.every(attrName => typeof attrName === 'string');
  return isShortcut ? (obj => pick(obj, filter)) : filter;
};



module.exports = {
  transformOptions,
};
