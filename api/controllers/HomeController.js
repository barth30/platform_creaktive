/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


	homepage : function(req,res){


		var json = {};



		Project.find().populate("phases").populate("permissions").populate("contributions").then(function(projects){
			json.projects = projects;
			Permission.find().populate("user").populate("project").populate('phase').then(function(permissions){
				json.permissions = permissions;
				User.find().populate('organizations').populate('permissions').populate('contributions').populate('projects').then(function(users){
					json.users = users;
					Organization.find().populate('users').populate('phases').then(function(organizations){
						json.organizations = organizations;
						Phase.find().populate("organizations").populate("inputs").populate("outputs").populate("contributions").populate('project').then(function(phases){
							json.phases = phases;
							Contribution.find().populate('project').populate("phase").populate('user').then(function(contributions){
								json.contributions = contributions;
								Input.find().populate('project').populate('phase').then(function(inputs){
									json.inputs = inputs;
									Element.find().then(function(elements){
										json.elements = elements;
										Link.find().then(function(links){
											json.links = links;

											Output.find().populate('project').populate('phase').then(function(outputs){
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

