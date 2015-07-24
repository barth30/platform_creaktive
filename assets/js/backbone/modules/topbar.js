/////////////////////////////////////////////////
var topbar = {
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
    // gestion des permissions impact sur l'affichage
    /*Init*/
    this.views.main = new this.Views.Main({
      el : json.el,
      user : json.user,
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////
// VIEWS
/////////////////////////////////////////
topbar.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.user          = json.user;
 
        // Templates
        this.template = JST["topbar_template"];
    },
    render : function(){
        $(this.el).empty();       
        $(this.el).append(this.template({user:this.user.toJSON()}));  
        return this;
    }
});
/***************************************/

