
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
        contributions: json.contributions
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

    $(this.el).append("<div class=\"row\"><div class=\"large-12 columns\"><div class=\"row collapse\"><div class=\"small-10 columns\"> <input id=\"contributionTextField\" type=\"text\" placeholder=\"...\"> </div> <div class=\"small-2 columns\"> <a href=\"#\" class=\"button postfix addContribution\">+</a> </div> </div> </div> </div>");

    var contributions = _.where(this.contributions.toJSON(), {id_contribution: id});

    $(this.el).append(this.template({
      contributions : contributions
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
    this.contributionComments = JSON.contributionComments ;

    this.template = JST["assets/templates/knowledge_template.html"];
    this.contributionComments.on("add",this.render,this);
    this.contributionComments.on("remove",this.render,this);
  },

  

  render: function(id){
    $(this.el).empty();
    //this.id_contributionComment = id;
    var contributionComments = _.where(this.contributionComments.toJSON(),{id_contributionComment : id});
    $(this.el).append(this.template({contribution:id, contributionComments : contributionComments}));
    return this;
  }
});
