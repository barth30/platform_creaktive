/**
* Input.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	// autoPK : false,
	schema : true,
  attributes: { 	
  	project      : { model : "Project"},
  	phase        : { model : "Phase"},
  	title        : { type : "string"},
  	content      : { type : "string"},
  	attachment   : { type : "string"}
  }
};

