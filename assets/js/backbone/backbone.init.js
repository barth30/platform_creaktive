io.socket.on("connect", function(){

	Backbone.Model.prototype.toJSON = function() {
		return JSON.parse(JSON.stringify(this.attributes));
	};
	var json = window.data_bootstraped;

	global.init(json, function(){

		avatar.init({
		    el: "#avatar_container",
		    currentUser: global.models.current_user
		});
		contribution_module.init({
	        el: "#contribution_container",
			contributions : global.collections.Contributions
	  	});

	    //Router
	    router.init();

	    /*activat of "hashchange events's monitoring"*/
	    if(!Backbone.History.started) Backbone.history.start();
	    console.log("Backbone application started...")
	  });
});
