
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
    "click .filter_date": 'filter_date',
    "click .filter_liked": 'filter_liked',
    "click .filter_commented": 'filter_commented',

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
      tag: "father",
      likes : 0
    });
  },

  filter_date: function (e) {
    e.preventDefault();
    $(this.el).empty();
    $(this.el).append(this.formtemplate({}));
    var contributions_liked = _.sortBy(this.contributions.toJSON(), function(contribution){
      contribution_creation_descend = new Date(contribution.createdAt).getTime() * (-1) ;
      return contribution_creation_descend;
    });
    var contributions_render = _.groupBy(contributions_liked, 'tag');

    var _this = this;
    _.each(contributions_render["father"], function (contribution) {
      var contributions_sons = contributions_render[contribution.id];
      $(_this.el).append(new brainstorming.Views.Idea({
        contribution: contribution,
        contributions: _this.contributions,
        phase: _this.phase,
        contributions_sons : contributions_sons,
        likes: _this.likes
      }).render().el);
      return this;
    });
  },


  filter_liked: function (e) {
    e.preventDefault();
    $(this.el).empty();
    $(this.el).append(this.formtemplate({}));
    var contributions_liked = _.filter(this.contributions.toJSON(), function(contribution){
      return contribution.likes !== 0;
    });
    var contributions_render = _.groupBy(contributions_liked, 'tag');

    var _this = this;
    _.each(contributions_render["father"], function (contribution) {
      var contributions_sons = contributions_render[contribution.id];
      $(_this.el).append(new brainstorming.Views.Idea({
        contribution: contribution,
        contributions: _this.contributions,
        phase: _this.phase,
        contributions_sons : contributions_sons,
        likes: _this.likes
      }).render().el);
      return this;
    });
  },

  filter_commented: function (e) {
    e.preventDefault();
    $(this.el).empty();
    $(this.el).append(this.formtemplate({}));


    var contributions_render = _.groupBy(this.contributions.toJSON(), 'tag');
    var contributions_classey = _.countBy(contributions_render, function(contribution){
      return contribution;
    });

    var _this = this;
    _.each(contributions_render["father"], function (contribution) {
      var contributions_sons = contributions_render[contribution.id];
      $(_this.el).append(new brainstorming.Views.Idea({
        contribution: contribution,
        contributions: _this.contributions,
        phase: _this.phase,
        contributions_sons : contributions_sons,
        likes: _this.likes
      }).render().el);
      return this;
    });
  },


  render: function () {
    $(this.el).empty();
    $(this.el).append(this.formtemplate({}));
    var _this = this;

    var contributions_render = _.groupBy(this.contributions.toJSON(), 'tag');

    _.each(contributions_render["father"], function (contribution) {
      var contributions_sons = contributions_render[contribution.id];
      $(_this.el).append(new brainstorming.Views.Idea({
        contribution: contribution,
        contributions: _this.contributions,
        phase: _this.phase,
        contributions_sons : contributions_sons,
        likes: _this.likes
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
    this.contributions = json.contributions;
    this.ideatemplate = JST["brainstorming_idea_template"];
    this.contributions_sons = json.contributions_sons;
  },

  events:{
    "click .addSon"         : 'addSon',
    "click .addLike"         : 'addLike'
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
        type: "idea",
        likes: 0
      });
    }
  },

  addLike: function (e){
    e.preventDefault();
    var nblikes = parseInt(e.target.getAttribute("data-likes-contribution"));
    this.contribution.likes = nblikes +1 ;
    this.contributions.get(this.contribution.id).save(this.contribution);
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
