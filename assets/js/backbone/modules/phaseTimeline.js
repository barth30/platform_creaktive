/////////////////////////////////////////////////
var phaseTimeline = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (json) {
    //if(phaseTimeline.views.main == undefined){
        this.views.main = new phaseTimeline.Views.Main({
            el : json.el,
            phase : json.phase
        });    
    //}
    this.views.main.render();
  },
  destroy: function(){
    // delete this.views;
    // delete this.models;
    // delete this.collections;
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
phaseTimeline.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.phase = json.phase;
        // Events
        // Templates
        this.template = JST["phaseTimeline_template"];
    },
    events : {

    },
    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.template({phase : this.phase.toJSON()}));
        if(this.phase.get('type') != undefined){
          // CADRAGE
          if(this.phase.get('type') == "cadrage"){
            cadrage.init({
              el : "#ck-phase-container",
              phase : this.phase
            });
          } else if(this.phase.get('type') == "exploration"){
            exploration.init({
              el : "#ck-phase-container",
              phase : this.phase
            });
          } else if(this.phase.get('type') == "share"){
            share.init({
              el : "#ck-phase-container",
              phase : this.phase
            });
          }else if(this.phase.get('type') == "brainstorming"){
            brainstorming.init({
              el : "#ck-phase-container",
              phase : this.phase
            })

          }else if(this.phase.get('type') == "converge"){
            converge.init({
              el : "#ck-phase-container",
              phase : this.phase
            })
          };
          // NORMALISATION
          ck_normalisation.init({
            el : "#ck-normalisation-container",
            phase : this.phase
          });
          // LOCALISATION
          ck_localisation.init({
            el : "#ck-localisation-container",
            phase : this.phase
          });
        }else{
          alert("Cette phase n'est pas typée");
        }
        
        $(document).foundation();
        return this;
    }
});