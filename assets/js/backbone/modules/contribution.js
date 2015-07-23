/**
 * Created by jeep on 7/21/15.
 */

var contribution = {

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
        this.views.contributions = new contribution.Views.Contributions({
            el            : json.el,
            contributions : json.contributions
        });
        this.views.contributions.render();
    }

};

///////////////////////////////////////////////
// CONTRIBUTIONS
///////////////////////////////////////////////

contribution.Views.Contributions = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.contributions = json.contributions;
    },

    //event on template
    events : {
    },

    render : function(){
        $(this.el).empty();
        var _this = this;
        //render des contributions
        this.contributions.each(function(kontribution){
            $(_this.el).append(new contribution.Views.Contribution({
                contribution : kontribution
            }).render().el);
        });
        return this;
    }
});


///////////////////////////////////////////////
// CONTRIBUTION
///////////////////////////////////////////////
contribution.Views.Contribution = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.contribution = json.contribution;
        //template
        this.template = JST["contribution-template"]
    },

    events : {
    },

    render : function(){
        $(this.el).empty();
        $(this.el).append(this.template({
            contribution: this.contribution.toJSON()
        }));
        return this;
    }
});



