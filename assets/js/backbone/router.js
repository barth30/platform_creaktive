var router = {

  init : function(){
    new this.router;  
  }
  

};



router.router = Backbone.Router.extend({

  routes: {
    ""                    : "manager",    
    "project/:id"         : "project",
    "project/:id/:phase"  : "phase",
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
    var project_phases = new global.Collections.Phase(global.collections.Phases.where({project : id}));
    projectTimeline.init({
      el : "#content_container",
      project : global.collections.Projects.get(id),
      users : global.collections.Users,
      organizations : global.collections.Organizations,
      phases : project_phases
    });

  }

});