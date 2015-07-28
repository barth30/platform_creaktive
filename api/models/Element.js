/**
* Element.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	// autoPK : false,


  	attributes: {
	    // id : { type : "string", primaryKey : true, required : true},
	    user: { type : "string"},
	    type : { type : "string"},
	    title : { type : "string"},
	    content : { type : "string"},
	    id_father: { type : "string"},
	    top : { type : "string"},
	    left:{ type : "string"},
	    project:{ type : "string"},
	    css_auto : { type : "string"},
	    css_manu : { type : "string"},
	    inside : { type : "string"},
	    phase : { type : "string"},
	    visibility : { type : "string"}
	}

};

