/**
* Phase.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	project       : { model : "Project"},
  	title         : { type : "string", required : true},
    content       : { type : "string"},
  	start         : { type : "date", requred : true},
  	end           : { type : "date", requred : true},
  	input         : { collection : "Input", via : "phase"},
  	output        : { collection : "Output", via : "phase"},
  	contributions : { collection : "Contribution", via :  "phase"},
  	groups        : { collection : "Group", via : "phases"}

  }
};

