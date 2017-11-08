'use strict';

const { uniq } = require('../../utilities');

// Add `modelscount` and `uniquecount`, using `results`.
// `modelscount` is the number of models in the response
// `uniquecount` is the same, without the duplicates
const getModelscount = function ({ results }) {
  const modelscount = results.length;
  const uniquecount = getUniquecount({ results });

  return { modelscount, uniquecount };
};

const getUniquecount = function ({ results }) {
  const keys = uniq(results, getModelnameId);
  return keys.length;
};

const getModelnameId = function ({ action: { modelname }, model: { id } }) {
  return `${modelname} ${id}`;
};

module.exports = {
  getModelscount,
};
