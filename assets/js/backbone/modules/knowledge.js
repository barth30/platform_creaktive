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
    
      this.views.contributions = new this.Views.Contributions({
        el: json.el,
        users: json.Users,
        contributions: json.Contributions

      });
    
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
    this.question = 
    this.template = JST["assets/templates/knowledge_template"];
    this.render;
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

    

    $(this.el).append(this.template({
      
      question : ["Quel est votre prénom CACA", "Quel est votre nom"]
    }));
    return this;
  }
});


