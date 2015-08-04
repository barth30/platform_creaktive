var underscore = require("underscore");

var CK_generator = {
  	//////////////////////////////////////////
  	get_frugale_axes : function(elements,level,cb){
  		var axes = [];
  		var arbo_frugal = CK_text.frugale();
  		elements.forEach(function(element){
	      // si on trouve des mots clef on associe un DD par mot clef
	      if((CK_analyse.checkAttributElementDefine("tag_","keyword",element))&&(element.type != "poche")){
	        var axes_de_recherche = {
	        	element : element, 
	        	axes : api.generateSentencesFromArbo(arbo_frugal,level,0,element.title)
	        }
	        axes.push(axes_de_recherche);
	      }
	    });
  	
	    if(cb) cb(axes);
	    else return axes;
	},
  	//////////////////////////////////////////
}

module.exports = Object.create(CK_generator);


