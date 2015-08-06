
var converge = {

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
   
    var contributions = new global.Collections.Contribution(global.collections.Contributions.filter(function(obj){
        return obj.get('phase').id == phase.get('id')
    })); 
    var inputs = new global.Collections.Input(global.collections.Inputs.filter(function(obj){
      return obj.get('phase').id == phase.get('id')
    }));
    var outputs = new global.Collections.Output(global.collections.Outputs.filter(function(obj){
        return obj.get('phase').id == phase.get('id')
    }));

    this.views.main = new this.Views.Main({
      el : json.el,
      phase : phase,
      contributions : contributions,
      outputs:outputs
    });

    this.views.main.render()
  }
};

///////////////////////////////////
// Vue main avec le formulaire pour poster une nouvelle idées
///////////////////////////////////
converge.Views.Main = Backbone.View.extend({

  initialize: function (json) {
    _.bindAll(this, "render");

    this.phase = json.phase;
    this.contributions = json.contributions; 
    this.outputs=json.outputs;
    this.template = JST["converge_form_template"];
    this.lesquestion = ["T'évanouir quand tu réponds à une question ?","Te recevoir une claque quand tu réponds à une question ?"];
 
  },
  events: {
    "click #validForm": 'dataForm',

  },
  dataForm : function(){

var titre = document.getElementById("titre").value; 
var description = document.getElementById("description").value; 
var deltaC = $('#deltaC').attr('data-slider');
var deltaK = $('#deltaK').attr('data-slider');
var answer = [];
for ( i=0; i< this.lesquestion.length; i++){
answer[i] = document.getElementById("contributionTextField"+i).value; 
}

var json ={
description : description,
deltaC : deltaC,
deltaK : deltaK,
answer : answer

};
var jsonanswer = JSON.stringify(json);
this.outputs.create({
  project      : this.phase.get('project').id,
   phase        : this.phase.id,
   title        : titre,
   content      : jsonanswer,
   attachment   : "",
})
console.log(this.outputs)
  },

  render: function () {
    $(this.el).empty();

    var _this = this;

    converge.views.ideas = [];
    _.each(this.phase.get('inputs'), function(input){
      var idea = new converge.Views.Idea({
        input : input
      })
      $(_this.el).append(idea.render().el)
      converge.views.ideas.push(idea);
    })

 
  $(this.el).append(this.template({
     question : this.lesquestion
    }));
    


    return this;
  }
});


///////////////////////////////////
// Vue d'une idée
///////////////////////////////////
converge.Views.Idea = Backbone.View.extend({

  initialize: function (json) {
    _.bindAll(this, "render");
 
    this.input = json.input;

    this.template = JST["converge_idea_template"]
  },


  render: function () {
    $(this.el).empty();
    var _this = this;

  
    $(this.el).append(this.template({input:this.input}));


    return this;
  }
});










