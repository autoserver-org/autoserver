'use strict';

const { throwError } = require('../../error');
const { isJsl } = require('../../jsl');

const { propertiesPlugin } = require('./properties');

// Plugin that adds who modified last each model:
//   created_by {User} - set on model creation
//   updated_by {User} - set on model creation, modification or deletion
// Are handled by the system, and cannot be overriden by users
// User is specified by opts:
//   [user="(user())"] {jsl} - current user
//   [model="user"] {string} - user's model name
const authorPlugin = function ({ idl, opts }) {
  validateConf({ idl, opts });
  return propertiesPlugin({ getProperties })({ idl, opts });
};

const validateConf = function ({ idl, opts: { user, model = 'user' } }) {
  if (user && !isJsl({ jsl: user })) {
    const message = 'In \'author\' plugin, \'user\' must be a JSL string';
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  if (typeof model !== 'string') {
    const message = `In 'author' plugin, 'model' must be a string: ${model}`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  if (!idl.models[model]) {
    const message = `'author' plugin requires 'idl.models.${model}'`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }
};

const getProperties = ({ user = '(user())', model = 'user' }) => ({
  created_by: {
    description: 'Who created this model',
    model,
    readOnly: true,
    transform: {
      value: `(${user}.id)`,
      test: '($COMMAND === "create")',
    },
  },
  updated_by: {
    description: 'Who last updated this model',
    model,
    readOnly: true,
    transform: `(${user}.id)`,
  },
});

module.exports = {
  authorPlugin,
};
