
var cadrage = {

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
      var contributions = new global.Collections.Contribution(global.collections.Contributions.filter(function(contribution){
        return contribution.get('phase').id == phase.get('id')
      }));
      var outputs = new global.Collections.Output(global.collections.Outputs.filter(function(output){
        return output.get('phase').id == phase.get('id')
      }));


      if(!this.views[phase.id]){
        this.views[phase.id] = new this.Views.Main({
          el: json.el,
          users: json.users,
          contributions: contributions,
          outputs: outputs,
          phase : phase
        });
      }
      this.views[phase.id].render()
  }
};

///////////////////////////////////
//CONTRIBUTIONS
///////////////////////////////////
cadrage.Views.Main = Backbone.View.extend({

  initialize: function (json) {
    _.bindAll(this, "render");
    this.el = json.el;
    this.contributions = json.contributions;
    this.phase = json.phase;
    this.outputs = json.outputs;



    
  },


  render: function () {
    $(this.el).empty();
    var _this = this;

    if(!cadrage.views[this.phase.id].fixed_questions){
        cadrage.views[this.phase.id].fixed_questions = new cadrage.Views.Fixed_questions({
            tagName : "div",
            className : "large-12 columns",
            users: _this.users,
            contributions: _this.contributions,
            phase : _this.phase
          });
      };
   $(_this.el).append(cadrage.views[this.phase.id].fixed_questions.render().el);

    if(!cadrage.views[this.phase.id].axe){
        cadrage.views[this.phase.id].axe = new cadrage.Views.axe({
            tagName : "div",
            className : "large-12 columns",
            outputs: _this.outputs,
            phase : _this.phase
          });
      };
   $(_this.el).append(cadrage.views[this.phase.id].axe.render().el);
    return this;
  }
});


cadrage.Views.Fixed_questions = Backbone.View.extend({
  initialize: function (json) {
    _.bindAll(this, "render");

    this.users = json.users;
    this.contributions = json.contributions;
    this.phase = json.phase;
    this.template = JST["cadrage_template"];

        this.contributions.on("add", this.render, this);
    this.contributions.on("remove", this.render, this);


  },

  events : {
    "click .answer" : "answer"
  },

  answer : function(e){
    e.preventDefault();
    var tag = e.target.getAttribute("data-question-tag");
    var answer = $("#contributionTextField"+tag).val();
    this.contributions.create({
      project: this.phase.get('project'),
      phase: this.phase.get('id'),
      content: answer,
      user: global.models.current_user,
      tag : tag
    });
  },
  render: function () {
    $(this.el).empty();
    var esquestion = [
      {q:"Quels sont les besoins ?",tag:"besoins"},
      {q:"Définir un autre élément qui pourrait faire disparaître le besoin?",tag:"element_perturbateur"},
      {q:"Quelles sont les cibles ?",tag:"cibles"},
      {q:"Quels sont les impacts ?",tag:"impacts"},
      {q:"Quesl sont les acteur ?",tag:"acteur"},
    ]
    $(this.el).append(this.template({
      questions : esquestion,
      contributions : this.contributions.toJSON(),
      
    }));

    return this;
  }
});
cadrage.Views.axe = Backbone.View.extend({
  initialize: function (json) {
    _.bindAll(this, "render");

    this.users = json.users;
    this.phase = json.phase;
    this.outputs = json.outputs
    this.template = JST["axe_exploration_template"];

    
    
    this.outputs.on("add", this.render, this);
    this.outputs.on("remove", this.render, this);
  },

  events : {
    "click .answer" : "answer"
  },

  answer : function(e){
    e.preventDefault();
    var answer = $("#contributionTextField").val();
    this.outputs.create({
      project: this.phase.get('project'),
      phase: this.phase.get('id'),
      title: answer
    });

  },
  render: function () {
    $(this.el).empty();
   
    $(this.el).append(this.template({
     outputs: this.outputs.toJSON()
    }));

    $(document).foundation();
    return this;
  }
});