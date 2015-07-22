var router = {

  init : function(){
    new this.router;  
  }
  

};



router.router = Backbone.Router.extend({

  routes: {
    ""        : "manager",    
    "project/:id"    : "project",  
    // "search/:query/p:page": "search"   // #search/kiwis/p7
  },

  manager: function() {
    projectTimeline.destroy();
    projectManager.init({
      el : "#content_container",
      users : global.collections.Users, 
      user : global.models.current_user,
      display : "block",
      projects : global.collections.Projects,
    });
  },

  project: function(id) {
    projectManager.destroy();
    projectTimeline.init({
      el : "#content_container",
      project : global.collections.Projects.get(id),
      users : global.collections.Users,
      groups : global.collections.Groups,
      phases : global.collections.Phases
    });

  }

});