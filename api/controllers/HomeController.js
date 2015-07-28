/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


	homepage : function(req,res){
		

		var json = {};



		Project.find().then(function(projects){ 
			json.projects = projects;
			Permission.find().then(function(permissions){ 
				json.permissions = permissions;
				User.find().then(function(users){ 
					json.users = users;
					Organization.find().then(function(organizations){ 
						json.organizations = organizations;
						Phase.find().populate("organizations").populate("inputs").populate("outputs").then(function(phases){ 
							json.phases = phases;
							Contribution.find().then(function(contributions){ 
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
												//A CHANGER QUAND ON AURA MIS L'AUTHENTIFICATION EN PLACE
												json.current_user = {
													id:1, 
													username : "bob", 
													avatar : "images/default_profile.png", 
													email: "bob@bob.com"
												};
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

