/**
 * Created by jeep on 8/14/15.
 */

var profile = {

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
    this.views.profile = new this.Views.Profile({
      el: json.el,
      currentUser: json.currentUser,
      users : json.users
    });
    this.views.profile.render();
  }
};

/////////////////////////////////////////////////////
//MAIN
///////////////////////////////////////////////////////

profile.Views.Profile = Backbone.View.extend({
  initialize : function(json) {
    _.bindAll(this, 'render');
    // Variables
    this.user = json.currentUser;
    this.users = json.users;
    //template
    this.template = JST["profile_template"];
    //events
    this.listenTo(this.users, 'create', this.render);
    this.listenTo(this.users, 'change', this.render);
  },

  events : {
    "click .changeAvatar": 'changeAvatar',
    "click .changeUsername": 'changeUsername',
    "click .changeFirstName": 'changeFirstName',
    "click .changeLastName": 'changeLastName',
    "click .changeEmail": 'changeEmail'
  },

changeUsername: function (e){
  e.preventDefault();
  this.user.username = $("#usernameField").val() ;
  this.users.get(this.user.id).save(this.user);
},

  render : function(){
    $(this.el).empty();
    $(this.el).append(this.template({
      user: this.user.toJSON()
    }));
    return this;
  }
});
