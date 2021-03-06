export const opts = {
  type: 'object',
  additionalProperties: false,
  required: ['url'],
  properties: {
    url: {
      type: 'string',
    },
    method: {
      type: 'string',
      enum: ['GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'DELETE'],
    },
    hostname: {
      type: 'string',
    },
    port: {
      type: 'integer',
      minimum: 0,
      maximum: 65_535,
    },
    auth: {
      type: 'string',
    },
    path: {
      type: 'string',
    },
  },
}
