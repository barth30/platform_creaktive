
var brainstorming = {

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
      var user = global.models.current_user;
      var contributions = new global.Collections.Contribution(global.collections.Contributions.filter(function(obj){
          return obj.get('phase').id == phase.get('id')
      }));
    /*var inputs = new global.Collections.Input(global.collections.Inputs.filter(function(obj){
        return obj.get('phase').id == phase.get('id')
      }));
      var outputs = new global.Collections.Output(global.collections.Outputs.filter(function(obj){
          return obj.get('phase').id == phase.get('id')
      }));*/

      this.views.main = new this.Views.Main({
        el : json.el,
        phase : phase,
        contributions : contributions,
        user: user
      });

    this.views.main.render()
  }
};

///////////////////////////////////
// Vue main avec le formulaire pour poster une nouvelle idée
///////////////////////////////////
brainstorming.Views.Main = Backbone.View.extend({

  initialize: function (json) {
    _.bindAll(this, "render");
    this.user = json.user;
    this.phase = json.phase;
    this.contributions = json.contributions;
    this.formtemplate = JST["brainstorming_form_template"];
    this.listenTo(this.contributions, 'create', this.render);
    this.listenTo(this.contributions, 'change', this.render);
  },

  events : {
    "click .addContribution": 'addContribution'
  },

  addContribution: function (e){
    e.preventDefault();
    var contributionTitleField = $("#contributionTitleField").val();
    var contributionContentField = $("#contributionContentField").val();
    this.contributions.create({
      project: this.phase.get('project'),
      phase: this.phase,
      content: contributionContentField,
      title: contributionTitleField,
      user: this.user
    });
  },

  render: function () {
    $(this.el).empty();
    $(this.el).append(this.formtemplate({}));
    var _this = this;
    this.contributions.each(function (contribution) {
      $(_this.el).append(new brainstorming.Views.Idea({
        contribution: contribution
      }).render().el);
      return this;
    });
  }

  });

///////////////////////////////////
// Vue d'une idée
///////////////////////////////////
brainstorming.Views.Idea = Backbone.View.extend({

  initialize: function (json) {
    _.bindAll(this, "render");
    this.phase = json.phase;
    this.contribution = json.contribution;
    this.ideatemplate = JST["brainstorming_idea_template"]
  },

  render : function(){
    $(this.el).empty();
    //render des idea
    $(this.el).append(this.ideatemplate({
      contribution  : this.contribution.toJSON(),
      className : "panel"
    }));
    return this;
  }

});
