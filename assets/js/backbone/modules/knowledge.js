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
    if (knowledge.views.main == undefined){
      this.views.main = new this.Views.Main({
        el : json.el,
        users : json.Users,
        contributions : json.Contributions
      });
    }
    this.views.main.render()
  }

};


///////////////////////////////////////
//MAIN
///////////////////////////////////////
knowledge.Views.Main = Backbone.View.extend({
  initialize: function(JSON){
    _.bindAll(this, "render");
      el = this.el;
      users = this.Users;
    this.contribution = JSON.contribution ;

    this.template = JST["assets/templates/knowledge_template.html"];
    this.comments.on("add",this.render,this);
    this.comments.on("remove",this.render,this);
  },

  events : {
    "click .addContributionComment": 'addComment'
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
  }


});
