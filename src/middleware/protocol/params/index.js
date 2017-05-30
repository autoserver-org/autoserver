'use strict';


const { mapAsync } = require('../../../utilities');
const { httpFillParams } = require('./http');


// Fill in request parameters: method, protocolMethod, params, payload
const fillParams = async function (opts) {
  const map = await mapAsync(paramsMap, async func => await func(opts));

  return async function fillParams(input) {
    const { jsl, protocol, logInfo } = input;

    const {
      method,
      protocolMethod,
      queryVars,
      headers,
      params,
      payload,
    } = await map[protocol](input);

    const newJsl = jsl.add({ $PARAMS: params });

    logInfo.add({
      method,
      protocolMethod,
      queryVars,
      headers,
      params,
      payload,
    });
    Object.assign(input, {
      method,
      protocolMethod,
      queryVars,
      headers,
      params,
      payload,
      jsl: newJsl,
    });

    const response = await this.next(input);
    return response;
  };
};

const paramsMap = {
  http: httpFillParams,
};


module.exports = {
  fillParams,
};
