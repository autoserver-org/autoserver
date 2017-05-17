'use strict';


const { commands } = require('../../../constants');


/**
 * "replace" action uses an "update" command
 **/
const replaceAction = async function () {
  return async function replaceAction(input) {
    const { sysArgs = {}, action } = input;

    if (action.type === 'replace') {
      const isMultiple = action.multiple;
      const command = commands.find(({ type, multiple }) => {
        return type === 'update' && multiple === isMultiple;
      });
      Object.assign(sysArgs, { pagination: false });
      Object.assign(input, { command, sysArgs });
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  replaceAction,
};
