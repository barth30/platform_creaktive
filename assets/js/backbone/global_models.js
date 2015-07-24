/***************************************/
global.Models.Contribution = Backbone.Model.extend({
    initialize : function Poche() {
    	this.urlRoot = "/element";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});

/***************************************/
global.Models.Organization = Backbone.Model.extend({
    initialize : function Organization() {
    	this.urlRoot = "/organization";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});

/***************************************/
global.Models.Input = Backbone.Model.extend({
    initialize : function Poche() {
    	this.urlRoot = "/input";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});

/***************************************/
global.Models.Output = Backbone.Model.extend({
    initialize : function Poche() {
    	this.urlRoot = "/output";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});

/***************************************/
global.Models.Permission = Backbone.Model.extend({
    initialize : function Poche() {
    	this.urlRoot = "/permission";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});

/***************************************/
global.Models.Phase = Backbone.Model.extend({
    initialize : function Poche() {
    	this.urlRoot = "/phase";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});

/***************************************/
global.Models.Project = Backbone.Model.extend({
    initialize : function Poche() {
    	this.urlRoot = "/project";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});

/***************************************/
global.Models.User = Backbone.Model.extend({
    initialize : function Poche() {
    	this.urlRoot = "/user";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});