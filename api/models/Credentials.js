/**
 * Credentials.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      client_name: {
          type: 'string'
      },
      client_id: {
          type: 'string'
      },
      password: {
          type: 'string'
      },
      private_key: {
          type: 'string'
      }
  }
};
