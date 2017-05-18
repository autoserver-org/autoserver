'use strict';


const { cloneDeep, pick } = require('lodash');

const { commands } = require('../../../constants');
const { getFilter } = require('./filter');


// Retrieves the input for the second "read" command
// It is used for final output of "upsert" action
const getSecondReadInput = function ({ input, prefix }) {
  input = cloneDeep(input);
  const { sysArgs, action } = input;

  const isMultiple = action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'read' && multiple === isMultiple;
  });
  const args = getReadArgs({ input, prefix });
  Object.assign(sysArgs, { pagination: false });
  Object.assign(input, { command, args, sysArgs });

  return input;
};

// Only keep args: { filter, order_by, page_size }
const getReadArgs = function ({ input, prefix }) {
  const readArgs = pick(input.args, ['order_by', 'page_size']);
  const filter = getFilter({ input, prefix });

  Object.assign(readArgs, { filter });
  return readArgs;
};


module.exports = {
  getSecondReadInput,
};
