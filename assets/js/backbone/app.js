//////////////////////////////////////////////////////////////////
//                    CONTROLLER DE CREAKTIVE 
//                        Global object 
//////////////////////////////////////////////////////////////////
var global = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  Functions: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  functions: {},
  // Constructor
  init: function (json,callback) {
     //////////////////////////////////////////////////////////////////
    // Data
    //////////////////////////////////////////////////////////////////
    this.eventAggregator = {};
    _.extend(this.eventAggregator, Backbone.Events);
    // Models
    this.models.current_user = new global.Models.User(json.current_user);
    this.models.current_project = undefined;
    this.models.current_phase = undefined;
    // Collection
    this.collections.Contributions = new global.Collections.Contribution(json.contributions);
    this.collections.Organizations = new global.Collections.Organization(json.organizations);
    this.collections.Inputs = new global.Collections.Input(json.inputs);
    this.collections.Outputs = new global.Collections.Output(json.outputs);
    this.collections.Permissions = new global.Collections.Permission(json.permissions);
    this.collections.Phases = new global.Collections.Phase(json.phases);
    this.collections.Projects = new global.Collections.Project(json.projects);
    this.collections.Users = new global.Collections.User(json.users);
    this.collections.Elements = new global.Collections.Element(json.elements);
    this.collections.Links = new global.Collections.Element(json.links);
    
    //////////////////////////////////////////////////////////////////
   
    /**
    * Configures the instance of TrackJS with the provided configuration.
    *
    * @method configure
    * @param {Object} params The Configuration object to apply
    * @returns {Boolean} True if the configuration was successful.
    */
    // try{
    //   trackJs.configure({
    //     // Custom session identifier.
    //     sessionId: this.models.currentProject.get('title'),
    //     // Custom user identifier.
    //     userId: this.models.current_user.get('email'),
    //   });
    // }catch(err){
    //   console.log("track is not defined")
    // }
    

    callback();
  },
  };

  