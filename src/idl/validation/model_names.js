'use strict';

const { singular, plural } = require('pluralize');

const { throwError } = require('../../error');

// Validate model are properly named
const validateModelNames = function (idl) {
  const models = idl.models || {};

  return Object.keys(models).reduce(
    (idlA, modelName) => checkModelName({ idl: idlA, modelName }),
    idl,
  );
};

const checkModelName = function ({ idl, modelName }) {
  // Checks that a word (e.g. a model) is an English word with a
  // different singular and plural form
  if (singular(modelName) === plural(modelName)) {
    const message = `Model name '${modelName}' must be an English word whose plural form differs from its singular form`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  return idl;
};

module.exports = {
  validateModelNames,
};
