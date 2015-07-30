/**
* Group.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  // Enforce model schema in the case of schemaless databases
  schema: true,
  // autoPK : false,

  attributes: {
  	 //id : { type : "string", primaryKey : true, required : true},

    title         : { type: 'string', unique: true },
    description   : { type : "string" },
    users         : { collection: 'User', via : "organizations"},
    phases        : { collection : "Phase", via : "organizations"}
  }
};
