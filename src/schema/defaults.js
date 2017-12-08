'use strict';

const { expandPath, has, set } = require('../utilities');
const { DEFAULT_DATABASE } = require('../database');

// Add schema default values
const addDefaults = function ({ schema }) {
  const schemaA = DEFAULT_VALUES.reduce(expandPaths, schema);
  return schemaA;
};

// Expand `*` in paths
const expandPaths = function (schema, { key, value }) {
  const keys = expandPath(schema, key);
  const schemaB = keys.reduce(
    (schemaA, keyA) => applyDefaultValue({ schema: schemaA, key: keyA, value }),
    schema,
  );
  return schemaB;
};

const applyDefaultValue = function ({ schema, key, value }) {
  const keyA = key.split('.');

  if (has(schema, keyA)) { return schema; }

  return set(schema, keyA, value);
};

// Order matters, as they are applied serially
const DEFAULT_VALUES = [
  { key: 'env', value: 'dev' },
  { key: 'collections.*.database', value: DEFAULT_DATABASE.name },
  {
    key: 'collections.*.attributes.id',
    value: { description: 'Unique identifier' },
  },
  { key: 'collections.*.attributes.*.type', value: 'string' },
  { key: 'collections.*.attributes.*.validate', value: {} },
  { key: 'log', value: [] },
  { key: 'databases', value: {} },
  { key: 'databases.memory', value: {} },
  { key: 'databases.memory.save', value: false },
  { key: 'databases.memory.data', value: {} },
  { key: 'databases.mongodb', value: {} },
  { key: 'databases.mongodb.hostname', value: 'localhost' },
  { key: 'databases.mongodb.port', value: 27017 },
  { key: 'databases.mongodb.dbname', value: 'data' },
  { key: 'databases.mongodb.opts', value: {} },
];

module.exports = {
  addDefaults,
};