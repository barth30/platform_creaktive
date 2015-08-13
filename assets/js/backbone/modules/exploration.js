
var exploration = {

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
    // if (exploration.views.contributions == undefined) {

      var phase = json.phase;
      var contributions = new global.Collections.Contribution(global.collections.Contributions.filter(function(contribution){
        return contribution.get('phase').id == phase.get('id')
      }));
      var outputs = new global.Collections.Output(global.collections.Outputs.filter(function(output){
        return output.get('phase').id == phase.get('id')
      }));
      //console.log(contributions.toJSON());

      this.views.main = new this.Views.Main({
        el: json.el,
        users: json.users,
        contributions: contributions,
        outputs: outputs,
        phase : phase
      });
    // }
    this.views.main.render()
  }
};

///////////////////////////////////
//CONTRIBUTIONS
///////////////////////////////////
exploration.Views.Main = Backbone.View.extend({

  initialize: function (json) {
    _.bindAll(this, "render");
    this.el = json.el;
    this.contributions = json.contributions;
    this.phase = json.phase;
    this.outputs = json.outputs;


    this.contributions.on("add", this.render, this);
    this.contributions.on("remove", this.render, this);
    
    this.outputs.on("add", this.render, this);
    this.outputs.on("remove", this.render, this);
    
  },


  render: function () {
    $(this.el).empty();
    var _this = this;

  exploration.views.fixed_questions = new exploration.Views.Fixed_questions({
        tagName : "div",
        className : "large-12 columns",
        users: _this.users,
        contributions: _this.contributions,
        phase : _this.phase
      });
 $(_this.el).append(exploration.views.fixed_questions.render().el);

    return this;
  }
});


exploration.Views.Fixed_questions = Backbone.View.extend({
  initialize: function (json) {
    _.bindAll(this, "render");

    this.users = json.users;
    this.contributions = json.contributions;
    this.phase = json.phase;
    this.template = JST["exploration_tab_template"];
    var tabBusiness =[];
    var tabUV =[];
    var tabUK =[];
    var tabTK =[];
    this.resultTab();
  },

  events : {
    "click .answer" : "answer"
  },
  resultTab : function(){

     _.each(this.contributions, function(contribution){ 
      if(contribution.tag == "business"){

        tabBusiness.push(contribution)
      }
      if(contribution.tag == "U/V"){
        this.tabUV.push(contribution)
      }
      if(contribution.tag == "UK"){
        tabUK.push(contribution)
      }
      if(contribution.tag == "TK"){
        tabTK.push(contribution)
      }


     })

  },

  answer : function(e){
    e.preventDefault();
    var tag = e.target.getAttribute("data-question-tag");
    var answer = $("#contributionTextField"+tag).val();
    this.contributions.create({
      project: this.phase.get('project').id,
      phase: this.phase.get('id'),
      content: answer,
      user: global.models.current_user,
      tag : tag
    });
  },
  render: function () {
    $(this.el).empty();

    $(this.el).append(this.template({
      business : this.tabBusiness,
      uv : this.tabUV,
      uk: this.tabUK,
      tk: this.tabTK
    }));

    return this;
  }
});
