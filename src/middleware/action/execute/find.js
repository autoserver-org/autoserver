'use strict';

const { COMMANDS } = require('../../../constants');

const { renameThis } = require('./rename_this');

/**
 * "find" action uses a "read" command
 **/
const findAction = async function (input) {
  const response = await renameThis.call(this, { input, actions });
  return response;
};

const getInput = function ({ input }) {
  const { args, action } = input;

  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'read' && multiple === isMultiple
  );

  const newArgs = Object.assign({}, args, { pagination: isMultiple });
  Object.assign(input, { command, args: newArgs });

  return input;
};

const actions = [
  {
    getArgs: getInput,
  },
];

module.exports = {
  findAction,
};
