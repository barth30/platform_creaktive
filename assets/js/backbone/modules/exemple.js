/**************************************/
var exemple = {
    // Classes
    Collections: {},
    Models: {},
    Views: {},
    // Instances
    collections: {},
    models: {},
    views: {},
    eventAggregator : global.eventAggregator,

    init: function (json) {
        this.views.main = new this.Views.Main({
            
        });

    }
};
/***************************************/
exemple.Views.Main = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables

        // Templates
        this.template = JST["exemple"]
        // Events
    },
    events : {

    },
    /////////////////////////////////////////
    // ACTIONS
    /////////////////////////////////////////

    /////////////////////////////////////////
    // RENDER
    /////////////////////////////////////////
    render : function(){
        return this;
    }
});



