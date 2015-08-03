/**
* Project.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	// autoPK : false,
  schema : true,
  attributes: {
  	// id : { type : "string", primaryKey : true, required : true},
  	
  	title            : { type : "string", required : true},
  	description      : { type : "string"},
  	user             : { model : "user" },
  	permissions      : { collection : "Permission", via: "project"},
  	phases           : { collection : "Phase", via: "project"},
  	contributions    : { collection : "Contribution", via: "project"},
  }
};

