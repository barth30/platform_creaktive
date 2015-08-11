
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
    // if (share.views.contributions == undefined) {

      var phase = json.phase;
      var contributions = new global.Collections.Contribution(global.collections.Contributions.filter(function(contribution){
        return contribution.get('phase').id == phase.get('id')
      }));

      //console.log(contributions.toJSON());

      this.views.main = new this.Views.Main({
        el: json.el,
        users: json.users,
        contributions: contributions,
        phase : phase
      });
    // }
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


  },


  render: function () {
    $(this.el).empty();
    var _this = this;

    var input = this.phase.get("inputs")[0];

    io.socket.post("/file/getfile", {file : input.attachment }, function(response){
      $(_this.el).append('<iframe src = "/ViewerJS/#'+response.url+'" width="800" height="600" allowfullscreen webkitallowfullscreen></iframe>')

      share.views.free_questions = new share.Views.Free_questions({
        tagName : "div",
        className : "large-12 columns",
        users: _this.users,
        contributions: _this.contributions,
        phase : _this.phase
      });
      $(_this.el).append(share.views.free_questions.render().el);

      share.views.fixed_questions = new share.Views.Fixed_questions({
        tagName : "div",
        className : "large-12 columns",
        users: _this.users,
        contributions: _this.contributions,
        phase : _this.phase
      });
      $(_this.el).append(share.views.fixed_questions.render().el);


    });

    return this;
  }
});


//////////////////////////////////////////////////////
// VIEW QUESTIONS FREE
/////////////////////////////////////////////////////
share.Views.Free_questions = Backbone.View.extend({
  initialize: function (json) {
    _.bindAll(this, "render");

    this.users = json.users;
    this.contributions = json.contributions;
    this.phase = json.phase;
    this.templateFreeQuestion = JST["share_freequestion_template"];
    this.contributions.on("add", this.render, this);
    this.contributions.on("remove", this.render, this);
  },

  events: {
    "click .addContribution": 'addContribution',
    "click .delContribution": 'delContribution',
    "click .addSon": 'addSon'
  },

  addContribution: function (e) {
    e.preventDefault();
    var freeContributionTextField = $("#freeContributionTextField").val();

    if (freeContributionTextField != "") {
      this.contributions.create({
        project: this.phase.get('project').id,
        phase: this.phase.get('id'),
        content: freeContributionTextField,
        user: global.models.current_user,
        tag: "father",
        type: "free"
      });
    }
  },

  addSon: function (e) {
    e.preventDefault();
    var father_id =  e.target.getAttribute("data-id-contribution");
    var sonTextField = $("#"+ father_id).val();

    if (sonTextField != "") {
      this.contributions.create({
        project: this.phase.get('project').id,
        phase: this.phase.get('id'),
        content: sonTextField,
        user: global.models.current_user,
        tag: father_id,
        type: "free"
      });
    }
  },


  delContribution : function(e){
    e.preventDefault();
    var contribution_id = e.target.getAttribute('data-id-contribution');
    var contribution = e.target.getAttribute('data-lacontribution');
    contribution.destroy(contribution_id);
    this.contributions.render();
  },

  render: function () {
    $(this.el).empty();

    $(this.el).append(
      " <fieldset>" +
    "<legend>Posez vos questions à l'animateur</legend>" +
    "<div class=\"row collapse\">" +
      "<div class=\"large-10 medium-10 small-10 columns\">" +
        "<textarea id=\"freeContributionTextField\" type=\"text\" placeholder=\"...\"></textarea>" +
      "</div>" +
        "<div class=\"large-2 medium-2 small-2 columns\">" +
        "<a href=\"#\" class=\"button addContribution\">Post!</a>" +
      "</div>" +
    "</div>"
    );

    var _this = this;

    var contributions_free = _.where(this.contributions.toJSON(),{type:"free"});

    var contributions_render = _.groupBy(contributions_free, 'tag');

    _.each(contributions_render.father, function(contribution_father){
      var contributions_sons = contributions_render[contribution_father.id];

      $(_this.el).append(_this.templateFreeQuestion({
        contribution : contribution_father,
        sons : contributions_sons
      }))

    });

    $(this.el).append(
      "</fieldset>"
    );

    return this;


  }
});


//////////////////////////////////////////////////////
// VIEW QUESTIONS FIXED
/////////////////////////////////////////////////////

share.Views.Fixed_questions = Backbone.View.extend({
  initialize: function (json) {
    _.bindAll(this, "render");

    this.users = json.users;
    this.contributions = json.contributions;
    this.phase = json.phase;
    this.letemplate = JST["share_fixedquestion_template"];
  },

  events : {
    "click .answer" : "answer"
  },

  answer : function(e){
    e.preventDefault();
    var tag = e.target.getAttribute("data-question-tag");
    var answer = $("#fixedContributionTextField"+tag).val();

    this.contributions.create({
      project: this.phase.get('project').id,
      phase: this.phase.get('id'),
      content: answer,
      user: global.models.current_user,
      tag : tag,
      type : "fixed"
    });
  },
  render: function () {
    $(this.el).empty();
    var esquestion = [
      {q:"Qu-est-ce qui vous a surpris dans cette présentation ?",tag:"surprise"},
      {q:"Quelles sont les connaissances maîtrisées en interne sur lesquelles s'appuyer pour créer de nouveaux concepts ?",tag:"k_known"},
      {q:"Quelles sont les connaissances à acquérir pour développer de nouveaux concepts",tag:"k_unknown"},
      {q:"Identifiez-vous des signaux faibles ?",tag:"signal"},
      {q:"Cette présentation vous a-t-elle donné des premières idées ?",tag:"idea"},
    ]
    $(this.el).append(this.letemplate({
      questions : esquestion
    }));

    return this;
  }
});
