/**
* Contribution.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	// autoPK : false,
  schema : true,
  attributes: {
  	// id : { type : "string", primaryKey : true, required : true},
  	project      : { model : "Project"},
  	phase        : { model : "Phase"},
  	user         : { model : "User"},
    subject      : { type : "string"},
  	title        : { type : "string"},
  	content      : { type : "string"},
  	attachment   : { type : "string"}
  }
};
