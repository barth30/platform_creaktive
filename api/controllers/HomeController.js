/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


	homepage : function(req,res){


		var json = {};



		Project.find().populateAll().then(function(projects){
			json.projects = projects;
			Permission.find().populateAll().then(function(permissions){
				json.permissions = permissions;
				User.find().populateAll().then(function(users){
					json.users = users;
					Organization.find().populateAll().then(function(organizations){
						json.organizations = organizations;
						Phase.find().populateAll().then(function(phases){
							json.phases = phases;
							Contribution.find().populateAll().then(function(contributions){
								json.contributions = contributions;
								Input.find().populateAll().then(function(inputs){
									json.inputs = inputs;
									Element.find().then(function(elements){
										json.elements = elements;
										Link.find().then(function(links){
											json.links = links;

											Output.find().populateAll().then(function(outputs){
												json.outputs = outputs;
											}).then(function(){
												json.current_user = req.user;

												res.view({json :JSON.stringify(json)});
											}).catch(function(e){
												res.serverError(e);
											});
										});
									});
								})
							})
						})
					})
				})
			})
		})





	}

};

