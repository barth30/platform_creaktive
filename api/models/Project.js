/**
* Project.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	title            : { type : "string", required : true},
  	description      : { type : "string"},
  	author           : { model : "user" },
  	permissions      : { collection : "Permission", via: "project"},
  	phases           : { collection : "Phase", via: "project"},
  	contributions    : { collection : "Contribution", via: "project"},
  }
};

