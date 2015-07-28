var router = {

  init : function(){
    new this.router;  
  }
  

};

router.router = Backbone.Router.extend({

  routes: {
    ""                    : "manager",    
    "project/:id"         : "project",
    "project/:id_project/:id_phase"           : "phase",
    // "search/:query/p:page": "search"   // #search/kiwis/p7
  },

  manager: function() {
    projectManager.init({
      el : "#content_container",
      users : global.collections.Users, 
      user : global.models.current_user,
      display : "block",
      projects : global.collections.Projects,
    });
    this.generate_breadcrumbs();
  },

  project: function(id) {
    // SET CURRENT PROJECT
    global.models.current_project = global.collections.Projects.get(id);
    // GET PHASES ASSOCIATE
    var project_phases = new global.Collections.Phase(global.collections.Phases.where({project : id}));
    // INIT DU MODULE DAFFICHAGE
    if(global.models.current_project != undefined){
      projectTimeline.init({
        el : "#content_container",
        project : global.models.current_project,
        users : global.collections.Users,
        organizations : global.collections.Organizations,
        phases : project_phases
      });  
    }
    this.generate_breadcrumbs(global.models.current_project);
  },

  phase : function(id_project,id_phase){
    // SET CURRENT PROJECT
    global.models.current_project = global.collections.Projects.get(id_project);
    // SET CURRENT PROJECT
    global.models.current_phase = global.collections.Phases.get(id_phase);
    // INIT DU MODULE DAFFICHAGE
    if(global.models.current_phase != undefined){
      phaseTimeline.init({
        el : "#content_container",
        phase : global.models.current_phase
      });      
    }
    this.generate_breadcrumbs(global.models.current_project,global.models.current_phase);
  },
  
  generate_breadcrumbs : function(project,phase){
    var breadcrumbs_ul = $('<ul>',{class:'breadcrumbs'});
    breadcrumbs_ul.append("<li><a href='/'>Manager</a></li>")
    if(project) breadcrumbs_ul.append("<li><a href='/#project/"+project.id+"'>"+project.get('title')+"</a></li>")
    if(phase) breadcrumbs_ul.append("<li><a href='/#phase/"+phase.id+"'>"+phase.get('title')+"</a></li>")
    $("#breacrumbs_container").html(breadcrumbs_ul)
  }

});