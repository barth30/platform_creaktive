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
    this.eventAggregator = {};//this.concepts.first();
    _.extend(this.eventAggregator, Backbone.Events);
    // Models
    
    // Collection
    this.collections.Contributions = new global.Collections.Contribution(json.contributions);
    this.collections.Groups = new global.Collections.Group(json.groups);
    this.collections.Inputs = new global.Collections.Input(json.inputs);
    this.collections.Outputs = new global.Collections.Output(json.outputs);
    this.collections.Permissions = new global.Collections.Permission(json.permissions);
    this.collections.Phases = new global.Collections.Phase(json.phases);
    this.collections.Projects = new global.Collections.Project(json.projects);
    this.collections.Users = new global.Collections.User(json.users);
    
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