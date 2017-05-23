'use strict';


module.exports = Object.assign(
  {},
  require('./error_handler'),
  require('./protocol_convertor'),
  require('./protocol_negotiator'),
  require('./protocol_error_handler'),
  require('./response'),
  require('./path'),
  require('./timestamp'),
  require('./ip'),
  require('./routing'),
  require('./logger'),
  require('./params'),
  require('./interface_convertor'),
  require('./interface_negotiator'),
  require('./interface_error_handler'),
  require('./interface_execute'),
  require('./action_convertor'),
  require('./action_validation'),
  require('./action_error_handler'),
  require('./action_execute'),
  require('./normalization'),
  require('./command_convertor'),
  require('./command_validation'),
  require('./command_error_handler'),
  require('./system_defaults'),
  require('./user_defaults'),
  require('./api_convertor'),
  require('./pagination'),
  require('./clean_delete'),
  require('./transform'),
  require('./database_convertor'),
  require('./validation'),
  require('./database_execute'),
  require('./no_response')
);
