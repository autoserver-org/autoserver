'use strict';

module.exports = {
  ...require('./normalize_empty'),
  ...require('./aliases'),
  ...require('./transform'),
  ...require('./user_defaults'),
  ...require('./system_defaults'),
  ...require('./readonly'),
  ...require('./pagination'),
  ...require('./authorize'),
  ...require('./features'),
  ...require('./data_validation'),

  ...require('./response_validation'),
  ...require('./empty_models'),
  ...require('./duplicate_read'),
  ...require('./missing_ids'),
  // eslint-disable-next-line import/max-dependencies
  ...require('./create_ids'),
};
