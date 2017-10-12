'use strict';

const yaml = require('js-yaml');

const { throwError } = require('../error');

// Parses a YAML file
const loadYaml = function ({ path, content }) {
  return yaml.load(content, {
    // YAML needs to JSON-compatible, since JSON must provide same
    // features as YAML
    schema: yaml.CORE_SCHEMA,
    json: true,
    // Error handling
    filename: path,
    onWarning (error) {
      throwError(error);
    },
  });
};

module.exports = {
  loadYaml,
};
