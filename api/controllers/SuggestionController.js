/**
 * SuggestionController
 *
 * @description :: Server-side logic for managing suggestions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	get_statuts : function(req,res){
		CK_analyse.get_statuts(req.body.elements,function(statuts){
			res.send(statuts);
		});
	},
	get_localisations : function(req,res){
		CK_analyse.get_localisations(req.body.elements,function(localisations){
			res.send(localisations);
		});
	},
	////////////////////////
	// V2OR ANALYSES
	////////////////////////
	get_originality_v2or_analyse : function(req,res){
		CK_analyse.get_originality_v2or(req.body.elements, req.body.links, function(analyse){
			res.send(analyse);
		});
	},
	get_variety_v2or_analyse : function(req,res){
		CK_analyse.get_variety_v2or(req.body.elements, req.body.links, function(analyse){
			res.send(analyse);
		});
	},
	get_value_v2or_analyse : function(req,res){
		CK_analyse.get_value_v2or(req.body.elements, req.body.links, function(analyse){
			res.send(analyse);
		});
	},
	get_strength_v2or_analyse : function(req,res){
		CK_analyse.get_strength_v2or(req.body.elements, req.body.links, function(analyse){
			res.send(analyse);
		});
	},
	get_risk_analyse : function(req,res){
		CK_analyse.get_risk_analyse(req.body.elements, req.body.links, function(analyse){
			res.send(analyse);
		});
	},
	////////////////////////
	get_explorations_analyse : function(req,res){
		CK_analyse.get_exploration_suggestions(req.body.elements, function(explorations){
			res.send(explorations);
		});
	},
	analyse_cadrage_keywords : function(req,res){
		CK_analyse.analyse_cadrage_keywords(req.body.elements, function(analyse){
			res.send(analyse);
		});
	},
	analyse_dd_keywords : function(req,res){
		CK_analyse.analyse_dd_keywords(req.body.elements, function(analyse){
			res.send(analyse);
		});
	},
	////////////////////////////
	get_frugale_concepts : function(req,res){
		CK_generator.get_frugale_concepts(req.body.keyword,req.body.level, function(concepts){
			res.send(concepts);
		});
	},
};

