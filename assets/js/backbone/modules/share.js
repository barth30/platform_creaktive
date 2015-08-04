
var share = {

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
    if (share.views.contributions == undefined) {

      var phase = global.collections.Phases.first();
      var contributions = new global.Collections.Contribution(global.collections.Contributions.filter(function(contribution){ 
        return contribution.get('phase').id == phase.get('id')
      }));

      console.log(contributions.toJSON());

      this.views.main = new this.Views.Main({
        el: json.el,
        users: json.users,
        contributions: contributions,
        phase : phase
      });
    }
    this.views.main.render()
  }
};

///////////////////////////////////
//CONTRIBUTIONS
///////////////////////////////////
share.Views.Main = Backbone.View.extend({

  initialize: function (json) {
    _.bindAll(this, "render");
    this.el = json.el;
    this.contributions = json.contributions;
    this.phase = json.phase;


    this.contributions.on("add", this.render, this);
    this.contributions.on("remove", this.render, this);
  },


  render: function () {
    $(this.el).empty();

    share.views.free_questions = new share.Views.Free_questions({
      users: this.users,
      contributions: this.contributions,
      phase : this.phase
    });
    $(this.el).append(share.views.free_questions.render().el);

    $(this.el).append("<hr>")

    share.views.fixed_questions = new share.Views.Fixed_questions({
      users: this.users,
      contributions: this.contributions,
      phase : this.phase
    });
    $(this.el).append(share.views.fixed_questions.render().el);

    return this;
  }
});


//////////////////////////////////////////////////////
// C'EST TON MODULE JEEP !
/////////////////////////////////////////////////////
share.Views.Free_questions = Backbone.View.extend({
  initialize: function (json) {
    _.bindAll(this, "render");

    this.users = json.users;
    this.contributions = json.contributions;
    this.phase = json.phase;
    
    this.letemplate = JST["share_freequestion_template"];
    

  },

  events: {
    "click .addContribution": 'addContribution',
    
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


//////////////////////////////////////////////////////
// C'EST TON MODULE JEEP !
/////////////////////////////////////////////////////
share.Views.Fixed_questions = Backbone.View.extend({
  initialize: function (json) {
    _.bindAll(this, "render");
    
    this.users = json.users;
    this.contributions = json.contributions;
    this.phase = json.phase;
    
    this.letemplate = JST["share_fixedquestion_template"];
    

  },

  events: {

    
  },

  addContribution: function (e) {
    e.preventDefault();

  },

  render: function () {
    $(this.el).empty();
    esquestion = ["Quel est ?","ton prenom ?"]
    $(this.el).append(this.letemplate({
      question : esquestion
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

  

  render: function(id){
    $(this.el).empty();
    //this.id_contributionComment = id;
    var contributionComments = _.where(this.contributionComments.toJSON(),{id_contributionComment : id});
    $(this.el).append(this.template({contribution:id, contributionComments : contributionComments}));
    return this;
  }
});*/
