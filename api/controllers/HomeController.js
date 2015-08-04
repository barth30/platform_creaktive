/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


	homepage : function(req,res){


		var json = {};



		Project.find().populate("phases").then(function(projects){
			json.projects = projects;
			Permission.find().then(function(permissions){
				json.permissions = permissions;
				User.find().then(function(users){
					json.users = users;
					Organization.find().populate('users').then(function(organizations){
						json.organizations = organizations;
						Phase.find().populate("organizations").populate("inputs").populate("outputs").populate("contributions").then(function(phases){
							json.phases = phases;
							Contribution.find().populate('project').populate("phase").populate('user').then(function(contributions){
								json.contributions = contributions;
								Input.find().then(function(inputs){
									json.inputs = inputs;
									Element.find().then(function(elements){
										json.elements = elements;
										Link.find().then(function(links){
											json.links = links;

											Output.find().then(function(outputs){
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

