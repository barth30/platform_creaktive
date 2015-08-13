var avatar = {

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
    this.views.user = new this.Views.User({
      el: json.el,
      currentUser: json.currentUser
    });
    this.views.user.render();
  }
};

/////////////////////////////////////////////////////
avatar.Views.User = Backbone.View.extend({
  initialize : function(json) {
    _.bindAll(this, 'render');
    // Variables
    this.user = json.currentUser;
    //template
    this.template = JST["avatar_template"]
  },

  events : {
  },

  render : function(){
    $(this.el).empty();
    $(this.el).append(this.template({
      user: this.user.toJSON()
    }));
    return this;
  }
});
