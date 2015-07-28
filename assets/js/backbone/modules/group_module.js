/**
 * Created by jeep on 7/23/15.
 */

var group_module = {

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
    this.views.organizations = new group_module.Views.Organizations({
      el             : json.el,
      organizations  : json.organizations,
      users          : json.users
    });
    this.views.organizations.render();
  }
};

///////////////////////////////////////////////
// GROUPS
///////////////////////////////////////////////

group_module.Views.Organizations = Backbone.View.extend({
  initialize : function(json) {
    _.bindAll(this, 'render');
    // Variables
    this.organizations = json.organizations;
    this.users = json.users;
    //template
  },

  //event on template
  events : {
  },

  render : function(){
    $(this.el).empty();
    var _this = this;

    //affichage de chaque groupe
    this.organizations.each(function(organization){
      $(_this.el).append(new group_module.Views.Organization({
        organization : organization,
        users : _this.users,
        className: "large-4 medium-6 small-6 columns panel radius callout"
      }).render().el);
    });

    //affichage du bouton addgroup
    $(this.el).append("<a href=\"#\" data-reveal-id=\"addgroup_modal\" class=\"large-4 medium-6 small-6 columns button right openModal\">+</a>");

    $(this.el).append(new group_module.Views.Formulaire({
      organizations :  this.organizations,
      tagName:        "div",
      className:      "reveal-modal",
      id:             "addgroup_modal"
    }).render().el);
    return this;
  }
});


///////////////////////////////////////////
//FORMULAIRE MODAL
///////////////////////////////////////////

group_module.Views.Formulaire = Backbone.View.extend({
  initialize : function(json) {
    _.bindAll(this, 'render');
    //variables
    this.organizations = json.organizations;
    // Events
    // Templates
    $(this.el).attr('data-reveal', '');
    this.template_form = JST["modalgroup_template"];
  },

  events : {
    "click .addGroup" : "addGroup"
  },

  addGroup : function(e){
    e.preventDefault();
    var title = $("#inputGroupTitle").val();
    var content = $("#inputGroupContent").val();
    this.organizations.create({
      title : title,
      description : content
    });
    group_module.views.organizations.render()
  },

  render : function(){
    $(this.el).empty();
    $(this.el).append(this.template_form({}));
    return this;
  }
});


///////////////////////////////////////////////
// GROUP
///////////////////////////////////////////////
group_module.Views.Organization = Backbone.View.extend({
  initialize : function(json) {
    _.bindAll(this, 'render');
    // Variables
    this.organization = json.organization;
    this.users = json.users;
    //templates
    this.templategroup = JST["group_template"];
    this.templateimagesgroup = JST["imagesgroup_template"]
  },

  events : {
  },

  render : function(){
    $(this.el).empty();
    //affichage des infos d'un groupe
    $(this.el).append(this.templategroup({
      organization  : this.organization.toJSON()
    }));
    //affichage des infos des utilisateurs
    var _this=this;
    this.users.each(function(user){
      $(_this.el).append(_this.templateimagesgroup({
        user        : user.toJSON()
      }));
    });
    return this;
  }
});
