/**
 * Created by jeep on 8/3/15.
 */


var knowledge={

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
    if (knowledge.views.contributions == undefined){
      this.views.contributions = new this.Views.Main({
        el : json.el,
        users : json.Users,
        contributions : json.Contributions
      });
    }
    this.views.contributions.render()
  }

};

///////////////////////////////////
//CONTRIBUTIONS
///////////////////////////////////


knowledge.Views.Contributions = Backbone.View.extend({

  initialize: function(json){
    _.bindAll(this, "render");
    this.el = json.el;
    this.contributions = json.contributions ;

    this.template = JST["assets/templates/knowledge_template.html"];
    this.contributions.on("add",this.render,this);
    this.contributions.on("remove",this.render,this);
  },

  events : {
    "click .addContribution": 'addContribution',
    "click .addContributionComment": 'addContributionComment'
  },

  addContribution: function(e){
    e.preventDefault();
    var contributionTextField = $("#contributionTextField").val();
    this.contributions.create({
      id_projet : this.id_projet,
      id_phase : this id_phase,
      content: contributionTextField
    });
  },

  render: function(){
    $(this.el).empty();
    //this.id_contribution = id;


    var posts = _.where(this.collectionPost.toJSON(),{id_post:id});

    $(this.el).append(this.template({channel:id,posts:posts}));

    return this;
  },



///////////////////////////////////////
//ContributionComments
///////////////////////////////////////


knowledge.Views.ContributionComments = Backbone.View.extend({
  el: "#containerComment",
  initialize: function(JSON){
    _.bindAll(this, "render");
    this.collectionComment = JSON.collectionComment ;

    this.template = JST["assets/templates/post_template.html"];
    this.collectionComment.on("add",this.render,this);
    this.collectionComment.on("remove",this.render,this);
  },

  events : {
    "click .addComment": 'addComment'
  },

  addComment: function(e){
    e.preventDefault();
    var commentField = $("#commentfield").val();
    this.collectionComment.create({
      name: commentField,
      id_comment : this.id_comment
    });
  },

  render: function(id){
    $(this.el).empty();
    this.id_comment=id;


    var comments = _.where(this.collectionComment.toJSON(),{id_comment:id});

    $(this.el).append(this.template({post:id, comments:comments}));

    return this;
  },


