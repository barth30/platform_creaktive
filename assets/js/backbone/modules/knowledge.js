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
        users: json.users,
        contributions: json.contributions,
        phase : json.phase
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
    this.phase = json.phase;
    this.letemplate = JST["knowledge_template"];
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
      project: this.phase.get('project').id,
      phase: this.phase.get('id'),
      content: contributionTextField
    });
  },

  render: function () {
    $(this.el).empty();

    $(this.el).append("<div class=\"row\"><div class=\"large-12 columns\"><div class=\"row collapse\"><div class=\"small-10 columns\"> <input id=\"contributionTextField\" type=\"text\" placeholder=\"...\"> </div> <div class=\"small-2 columns\"> <a href=\"#\" class=\"button postfix addContribution\">+</a> </div> </div> </div> </div>");

    $(this.el).append(this.letemplate({
      contributions : this.contributions.toJSON()
    }));
    return this;
  }
});


///////////////////////////////////////
//ContributionComments
//////////////////////////////////////


/*knowledge.Views.ContributionComments = Backbone.View.extend({
  initialize: function(JSON){
    _.bindAll(this, "render");
    this.contributionComments = JSON.contributionComments ;

    this.template = JST["knowledge_template.html"];
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
    //this.id_contributionComment = id;
    var contributionComments = _.where(this.contributionComments.toJSON(),{id_contributionComment : id});
    $(this.el).append(this.template({contribution:id, contributionComments : contributionComments}));
    return this;
  }
});*/
