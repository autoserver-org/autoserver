'use strict';


const { EngineError } = require('../../error');


// Fill in:
//  - `input.url`: full URL, e.g. used for logging
//  - `input.path`: URL's path, e.g. used by router
// Uses protocol-specific URL retrieval, but are set in a
// protocol-agnostic format, i.e. each protocol sets the same strings.
const parseUrl = async function (input) {
  const { protocolHandler, log, specific } = input;
  const perf = log.perf.start('protocol.parseUrl', 'middleware');

  const origin = getOrigin({ specific, protocolHandler });
  const path = getPath({ specific, protocolHandler });
  const url = `${origin}${path}`;

  log.add({ url, path, origin });
  Object.assign(input, { url, path, origin });

  perf.stop();
  const response = await this.next(input);
  return response;
};

const getOrigin = function ({ specific, protocolHandler }) {
  const origin = protocolHandler.getOrigin({ specific });

  if (typeof origin !== 'string') {
    const message = `'origin' must be a string, not '${origin}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return origin;
};

const getPath = function ({ specific, protocolHandler }) {
  const path = protocolHandler.getPath({ specific });

  if (typeof path !== 'string') {
    const message = `'path' must be a string, not '${path}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return path;
};


module.exports = {
  parseUrl,
};
