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

		Phase.findOne(req.query.phase).populateAll().exec(function(err, phase){
			if(err) return res.send(err)



			phase.results = [];
			_.each(phase.contributions, function(contribution){
				var c = {};
				c.title = contribution.title;
				c.content = contribution.content;
				c.tag = contribution.tag;
				// c = JSON.stringify(c);
				phase.results.push(c);
			});

			phase.save(function(err, p){
				res.send(p);
			})

		});
	},


	//////////////////////////////////////////////////////
	// Phases de Cadrage
	//////////////////////////////////////////////////////
	exploration_analyse : function(req,res){

		Phase.findOne(req.query.phase).populateAll().exec(function(err, phase){

			phase.results = phase.contributions;

			phase.save(function(err, p){
				res.send(p);
			})

		});
	},


	//////////////////////////////////////////////////////
	// Phases de Cadrage
	//////////////////////////////////////////////////////
	share_analyse : function(req,res){

		Phase.findOne(req.query.phase).populateAll().exec(function(err, phase){
			if(!phase.results) phase.results = [];

			phase.results = phase.contributions;

			phase.save(function(err, p){
				res.send(p);
			})

		});

	},

	//////////////////////////////////////////////////////
	// Phases de Cadrage
	//////////////////////////////////////////////////////
	brainstorm_analyse : function(req,res){

		Phase.findOne(req.query.phase).populateAll().exec(function(err, phase){
			if(!phase.results) phase.results = [];

			phase.results = phase.contributions;

			phase.save(function(err, p){
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

