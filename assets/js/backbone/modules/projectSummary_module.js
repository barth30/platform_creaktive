/**
 * Created by jeep on 8/19/15.
 */

var projectSummary_module = {

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
    var project = json.project;
    this.collections[project.id] = [];
    // SELECTION DES BONNES COLLECTIONS ICI
    this.collections[project.id].phases = new global.Collections.Phase(global.collections.Phases.filter(function(obj){
      return obj.get('project').id == project.get('id')
    }));

    this.views.main = new projectSummary_module.Views.Main({
      el : json.el,
      project: project
    });

    this.views.main.render();
  }
};

/////////////////////////////////////////////////////
//MAIN
/////////////////////////////////////////////////////
projectSummary_module.Views.Main = Backbone.View.extend({
  initialize : function(json) {
    _.bindAll(this, 'render');
    // Variables
    this.project = json.project;
    this.phases = projectSummary_module.collections[this.project.id].phases;
    //template
    this.template = JST["projectSummary_template"]
  },

  events : {
  },

  render : function(){
    $(this.el).empty();

    var cadrages = _.where(this.phases.toJSON(),{type:"cadrage"});
    var explorations = _.where(this.phases.toJSON(),{type:"exploration"});
    var shares = _.where(this.phases.toJSON(),{type:"share"});
    var brainstormings = _.where(this.phases.toJSON(),{type:"brainstorming"});
    var converges = _.where(this.phases.toJSON(),{type:"converge"});

   $(this.el).append(this.template({
      cadrages        : cadrages,
      explorations    : explorations,
      shares          : shares,
      brainstormings  : brainstormings,
      converges       : converges
    }));

    return this;
  }
});
