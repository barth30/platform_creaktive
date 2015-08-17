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

    this.collections.users = global.collections.Users;
    
    if(!this.views.profile){
      this.views.profile = new this.Views.Profile({
        el: json.el,
        currentUser: json.currentUser,
      });
    } 
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
    this.users = profile.collections.users;
    //template
    this.template = JST["profile_template"];
    //events
    this.listenTo(this.users, 'save', this.render);
    this.listenTo(this.users, 'change', this.render);
  },

  events : {
    "click .changeUsername": 'changeUsername',
    "click .changeFirstName": 'changeFirstName',
    "click .changeLastName": 'changeLastName',
    "click .changeEmail": 'changeEmail',
    "click .changeAvatar" : 'changeAvatar'
  },

changeUsername: function (e){
  e.preventDefault();
  if ($("#UserNameField").val() != "") {
  this.user.set({username : $("#usernameField").val()});
    this.users.get(this.user.id).save(this.user);
  }
},

  changeFirstName: function (e){
    e.preventDefault();
    if ($("#firstNameField").val() != "") {
      this.user.set({first_name : $("#firstNameField").val()});
      this.users.get(this.user.id).save(this.user);
    }
  },

  changeLastName: function (e){
    e.preventDefault();
    if ($("#lastNameField").val() != "") {
      this.user.set({last_name : $("#lastNameField").val()});
      this.users.get(this.user.id).save(this.user);
    }
  },

  changeEmail: function (e){
    e.preventDefault();
    if ($("#emailField").val() != "") {
      this.user.set({email : $("#emailField").val()});
      this.users.get(this.user.id).save(this.user);
    }
  },


  changeAvatar : function(e){
    e.preventDefault();
    var files = $("#attachment")[0].files;
    var _this = this;
    global.Functions.uploadFile(files,

      function(files){
        if(files.length > 0) {
          _this.user.set({avatar: files[0].fd});
          _this.users.get(_this.user.id).save(_this.user);
        }
      });
    },

  render : function(){
    $(this.el).empty();
    $(this.el).append(this.template({
      user: this.user.toJSON()
    }));
    return this;
  }
});
