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