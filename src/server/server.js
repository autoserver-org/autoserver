'use strict';


const { resolve } = require('path');

const { Log } = require('../logging');
const { processOptions } = require('../options');
const { startChain } = require('./chain');
const { httpStartServer } = require('./http');
const { handleStartupError } = require('./error');


// Used e.g. to shorten stack traces
global.apiEngineDirName = resolve(__dirname, '../..');

/**
 * Start server for each protocol, for the moment only HTTP
 *
 * @param {object} options
 * @param {object} options.idl - IDL definitions
 */
const startServer = async function (options = {}) {
  const { logger, loggerLevel } = options;
  options.startupLog = new Log({ logger, loggerLevel, type: 'startup' });

  try {
    return await start(options);
  } catch (error) {
    handleStartupError(error);
  }
};

const start = async function (options) {
  const opts = await processOptions(options);

  // Those two callbacks must be called by each server
  opts.handleRequest = await startChain(opts);
  opts.handleListening = handleListening.bind(null, opts);

  // Start each server
  const httpServer = httpStartServer(opts);

  // Make sure all servers are starting concurrently, not serially
  const [http] = await Promise.all([httpServer]);
  const servers = { http };
  return servers;
};

const handleListening = function ({ startupLog }, { protocol, host, port }) {
  const message = `${protocol.toUpperCase()} - Listening on ${host}:${port}`;
  startupLog.log(message, { type: 'startup' });
};


module.exports = {
  startServer,
};
