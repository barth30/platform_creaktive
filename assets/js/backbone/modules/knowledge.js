/**
 * Created by jeep on 8/3/15.
 */


var contribution={

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
    if (contribution.views.main == undefined){
      this.views.main = new this.Views.Main({
        el : json.el,
        users : global.collections.Users,
        mode    : json.mode,
        organization : json.organization
      });
    }
    this.views.main.render()
  }

};


///////////////////////////////////////
//MAIN
///////////////////////////////////////
contribution.Views.Main = Backbone.View.extend({
  el: "#knowledge_container",
  initialize: function(JSON){
    _.bindAll(this, "render");
    el : json.el,
      users : global.collections.Users,
    this.collectioncontribution = JSON.collectioncontribution ;

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
  }


});
