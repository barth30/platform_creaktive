
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
    if(!this.views[phase.id]){
      this.views[phase.id] = new this.Views.Main({
        el : json.el,
        phase : phase,
        contributions : contributions,
        user: user
      });
    }

    this.views[phase.id].render()
  }
};

///////////////////////////////////
// MAIN VIEW
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
    "click .addContribution": 'addContribution',
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
      user: this.user,
      type: "idea",
      tag: "father"
    });
  },

  render: function () {
    $(this.el).empty();
    $(this.el).append(this.formtemplate({}));
    var _this = this;

    var contributions_render = _.groupBy(this.contributions.toJSON(), 'tag');
    

    _.each(contributions_render["father"], function (contribution) {
      var contribution_id = contribution.id;
      if(!brainstorming.views[_this.phase.id].contribution_id){
        var contributions_sons = contributions_render[contribution.id];
        
        brainstorming.views[_this.phase.id].contribution_id =  new brainstorming.Views.Idea({
          contribution: contribution,
          contributions: _this.contributions,
          phase: _this.phase,
          contributions_sons : contributions_sons
        })
      }
      
      
      $(_this.el).append(brainstorming.views[_this.phase.id].contribution_id.render().el);
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
    this.contributions = json.contributions;
    this.ideatemplate = JST["brainstorming_idea_template"];
    this.contributions_sons = json.contributions_sons;
  },

  events:{
    "click .addSon"         : 'addSon'
  },

  addSon: function (e) {
    e.preventDefault();
    var father_id =  e.target.getAttribute("data-id-contribution");
    var sonTextField = $("#"+ father_id).val();

    if (sonTextField != "") {
      this.contributions.create({
        project: this.phase.get('project').id,
        phase: this.phase.get('id'),
        content: sonTextField,
        user: global.models.current_user,
        tag: father_id,
        type: "idea"
      });
    }
  },

  render : function(){
    $(this.el).empty();
    //render des idea

      $(this.el).append(this.ideatemplate({
      contribution  : this.contribution,
      sons : this.contributions_sons,
      className : "panel"
    }));

    return this;
  }

});
