/**
* Link.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	// autoPK : false,
  	attributes: {
  		// id : { type : "string", primaryKey : true, required : true},
        user : { type : "string"},
        source : { type : "string"},
        target : { type : "string"},
        project : { type : "string"},
  	}
};

