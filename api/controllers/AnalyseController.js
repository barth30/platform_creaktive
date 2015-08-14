/**
 * AnalyseController
 *
 * @description :: Server-side logic for managing analyses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


	//////////////////////////////////////////////////////
	// Phases de Cadrage
	//////////////////////////////////////////////////////
	cadrage_analyse : function(req,res){
		Phase.findOne(req.query.phase).populateAll().then(function(err, phase){
			if(!phase.results) phase.results = [];

			phase.results = phase.contributions;

			phase.save().then(function(err, p){
				res.send(p);
			})

		});
	},


	//////////////////////////////////////////////////////
	// Phases de Cadrage
	//////////////////////////////////////////////////////
	exploration_analyse : function(req,res){

		Phase.findOne(req.query.phase).populateAll().then(function(err, phase){
			if(!phase.results) phase.results = [];

			phase.results = phase.contributions;

			phase.save().then(function(err, p){
				res.send(p);
			})

		});
	},


	//////////////////////////////////////////////////////
	// Phases de Cadrage
	//////////////////////////////////////////////////////
	share_analyse : function(req,res){

		Phase.findOne(req.query.phase).populateAll().then(function(err, phase){
			if(!phase.results) phase.results = [];

			phase.results = phase.contributions;

			phase.save().then(function(err, p){
				res.send(p);
			})

		});

	},

	//////////////////////////////////////////////////////
	// Phases de Cadrage
	//////////////////////////////////////////////////////
	brainstorm_analyse : function(req,res){

		Phase.findOne(req.query.phase).populateAll().then(function(err, phase){
			if(!phase.results) phase.results = [];

			phase.results = phase.contributions;

			phase.save().then(function(err, p){
				res.send(p);
			})

		});

	},



	//////////////////////////////////////////////////////
	// Utils
	//////////////////////////////////////////////////////
	getKeywords : function(req,res){
		var phase_id = req.query.id;
		var text = "les frottements, l'énergie"
	    AlchemyAPI.keywords('text', text, { 'sentiment':0 }, function(response) {      
			// var output = [];
			// output['keywords'] = { text:text, response:JSON.stringify(response,null,4), results:response['keywords'] };
			res.send(response);
	    });
	}

	
};

