/////////////////////////////////////////////////
var phaseTimeline = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (json) {
    if(phaseTimeline.views.main == undefined){
        this.views.main = new phaseTimeline.Views.Main({
            el : json.el,
            phase : json.phase
        });    
    }
    this.views.main.render();
  },
  destroy: function(){
    // delete this.views;
    // delete this.models;
    // delete this.collections;
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
phaseTimeline.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.phase = json.phase;
        // Events
        // Templates
        this.template = JST["phaseTimeline_template"];
    },
    events : {

    },
    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.template());
        return this;
    }
});