/**
 * Created by jeep on 7/21/15.
 */

var contribution_module = {

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
        this.views.contributions = new contribution_module.Views.Contributions({
            el            : json.el,
            contributions : json.contributions,
            users : json.users
        });
        this.views.contributions.render();
    }

};

///////////////////////////////////////////////
// CONTRIBUTIONS
///////////////////////////////////////////////

contribution_module.Views.Contributions = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.contributions = json.contributions;
        this.users = json.users
    },

    //event on template
    events : {
    },

    render : function(){
        $(this.el).empty();
        var _this = this;
        //render des contributions
        this.contributions.each(function(contribution){
            $(_this.el).append(new contribution_module.Views.Contribution({
                contribution : contribution,
                user : _this.users.get(contribution.get("user"))
            }).render().el);
        });
        return this;
    }
});


///////////////////////////////////////////////
// CONTRIBUTION
///////////////////////////////////////////////
contribution_module.Views.Contribution = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.contribution = json.contribution;
        this.user = json.user;
        //template
        this.template = JST["contribution-template"]
    },

    events : {
    },

    render : function(){
        $(this.el).empty();
        $(this.el).append(this.template({
            contribution: this.contribution.toJSON(),
            user : this.user.toJSON()
        }));
        return this;
    }
});



