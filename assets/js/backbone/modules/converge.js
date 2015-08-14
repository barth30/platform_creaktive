
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

    if(!this.views[phase.id]){
      this.views[phase.id] = new this.Views.Main({
        el : json.el,
        phase : phase,
        contributions : contributions,
        outputs:outputs
      });
    }
    this.views[phase.id].render()
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
    this.lesquestion = [
    "Plus : bénéfices immédiats, points forts du concept",
    "Potentiels : retombés positives, bénéfices secondaires",
    "Craintes : risques associés au concept",
    "Opportunités : quelles solutions mettre en place pour développer le concept"
    ];
  this.outputs.on("add", this.render, this);
    this.outputs.on("remove", this.render, this);
  },
  events: {
    "click #validForm": 'dataForm',

  },
  dataForm : function(){

var titre = document.getElementById("titre").value; 
var description = document.getElementById("description").value; 
var deltaC = $('#deltaC').attr('data-slider');
var deltaK = $('#deltaK').attr('data-slider');
var deltaT = $('#deltaT').attr('data-slider');


var answer = [];
for ( i=0; i< this.lesquestion.length; i++){
answer[i] = document.getElementById("contributionTextField"+i).value; 
}

var json ={
description : description,
deltaC : deltaC,
deltaK : deltaK,
deltaT : deltaT,
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

   
    
    _.each(this.phase.get('inputs'), function(input){
      var input_id = input.id;
      if(!converge.views[_this.phase.id].input_id ){
        converge.views[_this.phase.id].input_id = new converge.Views.Idea({
          input : input
        })
      }
      $(_this.el).append(converge.views[_this.phase.id].input_id.render().el)
    })

 
  $(this.el).append(this.template({
     question : this.lesquestion
    }));

      if(!converge.views[this.phase.id].Fiche){
        converge.views[this.phase.id].Fiche = new converge.Views.Fiche({
            tagName : "div",
            className : "large-12 columns",
            outputs: _this.outputs,
            phase : _this.phase
          });
      };

$(this.el).append(converge.views[this.phase.id].Fiche.render().el);

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

///////////////////////////////////
// Vue d'une Fiche
///////////////////////////////////

converge.Views.Fiche = Backbone.View.extend({

  initialize: function (json) {
    _.bindAll(this, "render");
 
    this.outputs = json.outputs;

    this.template = JST["converge_fiche_template"]
    /* Add a basic data series with six labels and values */
var data = {
  labels: ['1', '2', '3', '4', '5', '6'],
  series: [
    {
      data: [1, 2, 3, 5, 8, 13]
    }
  ]
};

/* Set some base options (settings will override the default settings in Chartist.js *see default settings*). We are adding a basic label interpolation function for the xAxis labels. */
var options = {
  axisX: {
    labelInterpolationFnc: function(value) {
      return 'Calendar Week ' + value;
    }
  }
};

/* Now we can specify multiple responsive settings that will override the base settings based on order and if the media queries match. In this example we are changing the visibility of dots and lines as well as use different label interpolations for space reasons. */
var responsiveOptions = [
  ['screen and (min-width: 641px) and (max-width: 1024px)', {
    showPoint: false,
    axisX: {
      labelInterpolationFnc: function(value) {
        return 'Week ' + value;
      }
    }
  }],
  ['screen and (max-width: 640px)', {
    showLine: false,
    axisX: {
      labelInterpolationFnc: function(value) {
        return 'W' + value;
      }
    }
  }]
];

/* Initialize the chart with the above settings */
new Chartist.Line('#my-chart', data, options, responsiveOptions);
  },


  render: function () {
    $(this.el).empty();
    var _this = this;

  
    $(this.el).append(this.template({
      outputs: this.outputs.toJSON()
    }));


    return this;
  }
});








