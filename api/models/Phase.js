/**
* Phase.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  // autoPK : false,

  attributes: {
    // id : { type : "string", primaryKey : true, required : true},
    
  	project       : { model : "Project"},
  	title         : { type : "string", required : true},
    content       : { type : "string"},
    type          : { type : "string", required : true},
  	start         : { type : "date"},
  	end           : { type : "date"},
  	inputs         : { collection : "Input", via : "phase"},
  	outputs        : { collection : "Output", via : "phase"},
  	contributions : { collection : "Contribution", via :  "phase"},
  	organizations        : { collection : "Organization", via : "phases"}

  }
};

