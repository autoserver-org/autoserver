'use strict';

const { getFilter } = require('./filter');

// Retrieves the input for the second "read" command
// It is used for final output of "upsert" action
const getSecondReadInput = function ({ input }) {
  // The "real" commands are "create" and "update".
  // The first and second "find" commands are just here to patch things up,
  // and do not provide extra information to consumers, so should be
  // transparent when it comes to pagination and authorization
  return {
    command: 'read',
    args: {
      filter: getFilter({ input }),
      pagination: false,
      authorization: false,
    },
  };
};

module.exports = {
  getSecondReadInput,
};
