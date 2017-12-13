'use strict';

module.exports = {
  ...require('./load'),
  ...require('./plugins'),
  ...require('./colls_default'),
  ...require('./circular_refs'),
  ...require('./json_schema_data'),
  ...require('./syntax'),
  ...require('./defaults'),
  ...require('./collname'),
  ...require('./required_id'),
  ...require('./type'),
  ...require('./nested_coll'),
  ...require('./type_validation'),
  ...require('./alias'),
  ...require('./description'),
  ...require('./authorize'),
  ...require('./patch_operators'),
  ...require('./log'),
  ...require('./shortcuts'),
  ...require('./validate_collname'),
  ...require('./database'),
  ...require('./limits'),
  ...require('./json_schema'),
  // eslint-disable-next-line import/max-dependencies
  ...require('./rpc'),
};