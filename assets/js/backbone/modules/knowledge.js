/**
 * Created by jeep on 8/3/15.
 */


var knowledge= {

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
    if (knowledge.views.contributions == undefined) {
      this.views.contributions = new this.Views.Contributions({
        el: json.el,
        users: json.Users,
        contributions: json.Contributions
      });
    }
    this.views.contributions.render()
  }
};

///////////////////////////////////
//CONTRIBUTIONS
///////////////////////////////////


knowledge.Views.Contributions = Backbone.View.extend({

  initialize: function (json) {
    _.bindAll(this, "render");
    this.el = json.el;
    this.contributions = json.contributions;

    this.template = JST["assets/templates/knowledge_template.html"];
    this.contributions.on("add", this.render, this);
    this.contributions.on("remove", this.render, this);
  },

  events: {
    "click .addContribution": 'addContribution',
    "click .addContributionComment": 'addContributionComment'
  },

  addContribution: function (e) {
    e.preventDefault();
    var contributionTextField = $("#contributionTextField").val();
    this.contributions.create({
      id_project: this.id_project,
      id_phase: this.id_phase,
      content: contributionTextField
    });
  },

  render: function () {
    $(this.el).empty();
    this.id_contribution = id;


    var posts = _.where(this.contributions.toJSON(), {id_contribution: id});

    $(this.el).append(this.template({
      channel: id,
      posts: posts
    }));
    return this;
  }
});


///////////////////////////////////////
//ContributionComments
//////////////////////////////////////


knowledge.Views.ContributionComments = Backbone.View.extend({
  initialize: function(JSON){
    _.bindAll(this, "render");
    this.cntributionComments = JSON.cntributionComments ;
    this.template = JST["assets/templates/knowledge_template.html"];
    this.contributionComments.on("add",this.render,this);
    this.contributionComments.on("remove",this.render,this);
  },

  events : {
    "click .addContributionComments": 'addContributionComments'
  },

  addContributionComments: function(e){
    e.preventDefault();
    var contributionCommentTextField = $("#contributionCommentTextField").val();
    this.contributionComment.create({
      content : contributionCommentTextField,
      id_project : this.id_project,
      id_phase : this.id_phase
    });
  },

  render: function(id){
    $(this.el).empty();
    this.id_contributionComment=id;
    var contributionComments = _.where(this.contributionComments.toJSON(),{id_contributionComment:id});
    $(this.el).append(this.template({post:id, contributionComments : contributionComments}));
    return this;
  }
});
