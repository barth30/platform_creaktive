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
      contributions : json.contributions
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
  },

  //event on template
  events : {
  },

  render : function(){
    $(this.el).empty();
    $(this.el).append("<p>Dernières contributions</p>");
    var _this = this;
    //render des contributions
    this.contributions.each(function(contribution){
      $(_this.el).append(new contribution_module.Views.Contribution({
        contribution  : contribution
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
    //template
    this.template = JST["contribution_template"]
  },

  events : {
  },

  render : function(){
    $(this.el).empty();
    $(this.el).append(this.template({
      contribution  : this.contribution.toJSON()
    }));
    return this;
  }
});
