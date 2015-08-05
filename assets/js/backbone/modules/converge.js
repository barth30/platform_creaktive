
var converge = {

  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  eventAggregator: global.eventAggregator,


  init: function (json) {

    var phase = json.phase;
    var contributions = new global.Collections.Contribution(global.collections.Contributions.filter(function(obj){
        return obj.get('phase').id == phase.get('id')
    })); 
    var inputs = new global.Collections.Input(global.collections.Inputs.filter(function(obj){
      return obj.get('phase').id == phase.get('id')
    }));
    var outputs = new global.Collections.Output(global.collections.Outputs.filter(function(obj){
        return obj.get('phase').id == phase.get('id')
    }));

    this.views.main = new this.Views.Main({
      el : json.el,
      phase : phase,
      contributions : contributions
    });

    this.views.main.render()
  }
};

///////////////////////////////////
// Vue main avec le formulaire pour poster une nouvelle idées
///////////////////////////////////
converge.Views.Main = Backbone.View.extend({

  initialize: function (json) {
    _.bindAll(this, "render");

    this.phase = json.phase;
    this.contributions = json.contributions; 
    this.template = JST["converge_form_template"]
 
  },


  render: function () {
    $(this.el).empty();
    var _this = this;

  
    


    return this;
  }
});










