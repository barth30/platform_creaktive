/**
* Element.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	autoPK : false,


  attributes: {
    user: {model : "User"},
    type : { type : "string"},
    title : { type : "string"},
    content : { type : "string"},
    id_father: {model : "Element"},
    top : { type : "string"},
    left:{ type : "string"},
    project:{model:"Project"},
    css_auto : { type : "string"},
    css_manu : { type : "string"},
    inside : { type : "string"},
    visibility : { type : "string", defaultTo : "show"}
  }

};

