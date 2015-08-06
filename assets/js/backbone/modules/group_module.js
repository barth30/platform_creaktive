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
      id             : json.id,
      className      : json.className,
      tagName        : json.tagName,
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
    $(this.el).append("<a href=\"#\" data-reveal-id=\"addgroup_modal\" class=\"large-4 medium-6 small-6 columns button radius right openModal\">Add group</a>");

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
    if (title != "") {
      this.organizations.create({
        title: title,
        description: content,
        users : []
      });
      group_module.views.organizations.render()
    }
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
    this.templateimagesgroup = JST["imagesgroup_template"];

    this.listenTo(this.organization, 'change', this.render)
  },

  events : {
    "click .openUserManager" : "openUserManager",
    "click .delGroup" : "delGroup"
  },

  delGroup : function(e){
    e.preventDefault();
    var group_id_ = e.target.getAttribute('data-id-group');
    this.organization.destroy(group_id_);
    group_module.views.organizations.render();
  },

  openUserManager : function(){
    // Members editor
    //if(user_manager.views.main != undefined) user_manager.views.main.close();
    user_manager.init({
      el : "#members_manager_modal",
      users : this.users,
      organization: this.organization
    });
  },

  render : function(){
    $(this.el).empty();
    //affichage des infos d'un groupe
    $(this.el).append(this.templategroup({
      organization  : this.organization.toJSON()
    }));
    //affichage des avatars des utilisateurs
    var _this=this;

    if(this.organization.get('users')){
      _.each(this.organization.get('users'), function(user){
        $(_this.el).append(_this.templateimagesgroup({
          user        : user
        }));
      });
    }

    $(this.el).append(
      "<span class=\"large-3 medium-3 small-3 colums\">" +
        "<a href=\"#\" aria-haspopup=\"true\" data-reveal-id=\"members_manager_modal\" class=\"button radius tiny success openUserManager\">+ -</a>" +
      "</span> <div id=\"members_manager_modal\" class=\"modalContainer reveal-modal medium\" data-reveal></div>"
    );

    return this;
  }
});
