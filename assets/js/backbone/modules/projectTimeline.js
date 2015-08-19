/////////////////////////////////////////////////
var projectTimeline = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (json) {

    var project = json.project;
    var organizations = global.collections.Organizations;
    var permissions = global.collections.Permissions;

    this.collections[project.id] = [];
    // SELECTION DES BONNES COLLECTIONS ICI
    this.collections[project.id].phases = new global.Collections.Phase(global.collections.Phases.filter(function(obj){
        return obj.get('project').id == project.get('id')
    }));;
    this.collections[project.id].inputs = new global.Collections.Input(global.collections.Inputs.filter(function(obj){
        return obj.get('project').id == project.get('id')
    }));
    this.collections[project.id].outputs = new global.Collections.Output(global.collections.Outputs.filter(function(obj){
        return obj.get('project').id == project.get('id')
    }));
    this.collections[project.id].contributions = new global.Collections.Contribution(global.collections.Contributions.filter(function(obj){
        return obj.get('project').id == project.get('id')
    }));
    this.collections[project.id].users = global.collections.Users;

    this.collections[project.id].organizations = global.collections.Organizations;

    global.Functions.fetchAll(this.collections[project.id],"project",project.id, function(err){
            if(err) return alert(err);
            if(!projectTimeline.views[project.id]){
                projectTimeline.views[project.id] = new projectTimeline.Views.Main({
                    el : json.el,
                    project : json.project,
            });
        } 
        projectTimeline.views[project.id].render();
    })
    

    
  },
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
projectTimeline.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.project = json.project;
        
        this.users = projectTimeline.collections[this.project.id].users;
        this.organizations = projectTimeline.collections[this.project.id].organizations;
        this.phases = projectTimeline.collections[this.project.id].phases;
        this.permissions = projectTimeline.collections[this.project.id].permissions;
        this.outputs = projectTimeline.collections[this.project.id].outputs;
        this.inputs = projectTimeline.collections[this.project.id].inputs;
        this.contributions = projectTimeline.collections[this.project.id].contributions;
        // Events
        // Templates
        this.template = JST["projectTimeline_template"];

        this.listenTo(this.phases, "add", this.render);
        this.listenTo(this.phases, "remove", this.render);
    },

    events : {
        "click .config" : "config"
    },

    config : function(e){
        e.preventDefault();
        var phase = this.phases.get(e.target.getAttribute("data-phase-id"));
        projectTimeline.views.config_form.render(phase, function(){
        $( "#from" ).datepicker({
          defaultDate: 0,
          changeMonth: true,
          numberOfMonths: 2,
          dateFormat: "dd-mm-yy",
          dayNamesMin: [ "Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa" ],
          dayNames: [ "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi" ],
          monthNames: [ "Janvier", "Févire", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ],
          monthNamesShort: ["Jan","Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aou", "Sep", "Oct", "Nov", "Déc"],
          onClose: function( selectedDate ) {
            $( "#to" ).datepicker( "option", "minDate", selectedDate );
          }
        });
        $( "#to" ).datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 2,
          dateFormat: "dd-mm-yy",
          dayNamesMin: [ "Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa" ],
          dayNames: [ "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi" ],
          monthNames: [ "Janvier", "Févire", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ],
          monthNamesShort: ["Jan","Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aou", "Sep", "Oct", "Nov", "Déc"],
          onClose: function( selectedDate ) {
            $( "#from" ).datepicker( "option", "maxDate", selectedDate );
          }
        })

            $('#config_modal').foundation('reveal', 'open');
        });

    },

    render : function(){
        $(this.el).empty();
        var _this = this;

        //Ajout du template de la page
        $(this.el).append(this.template({
            project : this.project.toJSON(),
            phases : this.phases.toJSON()
        }));

        // Ajout de toutes les phases
        var phase_cadrage = this.phases.findWhere({type : "cadrage"});//this.phases.get(_.findWhere(this.project.get('phases'), {type : "cadrage"}).id);

        var phases_exploration = this.phases.where({type : "exploration"});

        var phases_share = this.phases.where({type : "share"});

        var phase_brainstorming = this.phases.where({type : "brainstorming"});

        var phase_converge = this.phases.where({type : "converge"});

        // Ajout de la vue Cadrage
        if(!projectTimeline.views[phase_cadrage.id]) {
            projectTimeline.views[phase_cadrage.id] = new projectTimeline.Views.Phase_cadrage({
                phase : phase_cadrage,
                project : this.project,
                outputs : this.outputs,
                phases : this.phases,
                tagName : 'div',
                className : "large-12 columns phase-panel phase_cadrage",
                id : phase_cadrage.get('id')
            });
        }
        $("#phases_container").append(projectTimeline.views[phase_cadrage.id].render().el);

        // Ajout des vues Exploration

        _.each(phases_exploration, function(exploration){
            if(!projectTimeline.views[exploration.id]){
                    projectTimeline.views[exploration.id] = new projectTimeline.Views.Phase_exploration({
                    phase : exploration,
                    phases : _this.phases,
                    project : _this.project,
                    outputs : _this.outputs,
                    inputs :_this.inputs,
                    tagName : 'div',
                    className : "large-12 columns phase-panel phase_exploration",
                    id : exploration.get('id')
                });
            };
            $("#phases_container").append(projectTimeline.views[exploration.id].render().el);

        });

        // Ajout des vues Partage
        _.each(phases_share, function(share){
            if(!projectTimeline.views[share.id]){
                projectTimeline.views[share.id]  = new projectTimeline.Views.Phase_share({
                    phase : share,
                    phases : _this.phases,
                    project : _this.project,
                    outputs : _this.outputs,
                    inputs :_this.inputs,
                    contributions : _this.contributions,
                    tagName : 'div',
                    className : "large-12 columns phase-panel phase_share",
                    id : share.get('id')
                });
            };
            $("#phases_container").append(projectTimeline.views[share.id].render().el);
        })

        // Ajout des vues brainstorming
        _.each(phase_brainstorming, function(bs){
            if(!projectTimeline.views[bs.id]){
                projectTimeline.views[bs.id] = new projectTimeline.Views.Phase_brainstorming({
                    phase : bs,
                    phases : _this.phases,
                    project : _this.project,
                    outputs : _this.outputs,
                    inputs :_this.inputs,
                    contributions : _this.contributions,
                    tagName : 'div',
                    className : "large-12 columns phase-panel phase_share",
                    id : bs.get('id')
                });
            };
            $("#phases_container").append(projectTimeline.views[bs.id].render().el);
        })


                // Ajout des vues Partage
        projectTimeline.views.converge = [];
        _.each(phase_converge, function(converge){
            if(!projectTimeline.views[converge.id]){
                projectTimeline.views[converge.id] = new projectTimeline.Views.Phase_converge({
                    phase : converge,
                    phases : _this.phases,
                    project : _this.project,
                    outputs : _this.outputs,
                    inputs :_this.inputs,
                    contributions : _this.contributions,
                    tagName : 'div',
                    className : "large-12 columns phase-panel phase_share",
                    id : converge.get('id')
                });
            }
            $("#phases_container").append(projectTimeline.views[converge.id].render().el);
        })


        // Formulaires 
        if(!projectTimeline.views.config_form){
            projectTimeline.views.config_form  = new projectTimeline.Views.Config_form({
                tagName : "div",
                className : "reveal-modal",
                id : "config_modal",
                organizations : this.organizations,
                project : this.project,
                phases : this.phases  
            });
        }
        $(this.el).append(projectTimeline.views.config_form.render().el);


        //ICI ajouter les init des modukes suggestion, etc.
        ck_evaluation.init({
            el : "#ck_evaluation_container",    
        });
        // ICI ajouter les axes de travail potentiel
        ck_generator_frugal.init({
            el : "#ck_axes_travail_generation",
        });
        
        $(document).foundation();
        return this;
    }
});




/////////////////////////////////////////////////
// Formulaire d'ajout d'une organisation à une phase
//////////////////////////////////////////////////
projectTimeline.Views.Config_form = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.organizations = json.organizations;
        this.projects = json.projects;
        this.phases = json.phases;
        this.selected_organizations = [];
        // Events
        // Templates
        $(this.el).attr('data-reveal', '');
        this.template = JST["projectTimeline_config_template"];


    },




    
    render : function(phase, cb){        
        $(this.el).empty();
        if(phase){
            $(this.el).append(this.template({
                phase : phase.toJSON(),
                organizations : this.organizations.toJSON()
            }));
        }

        if(cb) cb();
    
        return this;
    }
});

/////////////////////////////////////////////////////
// CADRAGE VIEW
/////////////////////////////////////////////////////
projectTimeline.Views.Phase_cadrage = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.phase = json.phase;
        this.project = json.project;
        this.outputs = json.outputs;
        this.phases = json.phases;
        // Events
        // Templates
        this.template = JST["projectTimeline_cadrage_template"];
    },
    events : {
        "click .explore" : "explore",
        "click .analyse" : "analyse"
    },

    analyse : function(e){
        e.preventDefault();
        var phase_id = e.target.getAttribute("data-phase-id");
        var _this = this;
        if(phase_id == this.phase.id){
            io.socket.get("/analyse/cadrage_analyse?phase="+phase_id, function(response){
                _this.phase = response;
                _this.render();
            });
        }
    },

    explore : function(e){
        e.preventDefault();
        var output = this.outputs.get(e.target.getAttribute("data-output-id"));
        this.phases.create({
            project           : this.project.get('id'),
            title             : output.get("title"),
            type              : "exploration",
            // start             : { type : "date"},
            // end               : { type : "date"},
            // inputs            : { collection : "Input", via : "phase"},
            following         : this.phase.get('id')
        }, {wait : true})

    },

    render : function(){
        $(this.el).empty();

        var contributions = _.groupBy(this.phase.get('results'), "tag");

        $(this.el).append(this.template({
            phase : this.phase.toJSON(),
            project : this.project.toJSON(),
            contributions : contributions
        }));
       
        return this;
    }
});


/////////////////////////////////////////////////////
// EXPLORATION VIEW
/////////////////////////////////////////////////////
projectTimeline.Views.Phase_exploration = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.phase = json.phase;
        this.project = json.project;
        this.outputs = json.outputs;
        this.inputs = json.inputs;
        this.phases = json.phases;
        // Events
        // Templates
        this.template = JST["projectTimeline_exploration_template"];
    },
    events : {
        "click .share" : "share",
        "click .analyse" : "analyse"
    },


    analyse : function(e){
        e.preventDefault();
        var phase_id = e.target.getAttribute("data-phase-id");
        var _this = this;
        if(phase_id == this.phase.id){
            io.socket.get("/analyse/exploration_analyse?phase="+phase_id, function(response){
                _this.phase = response;
                _this.render();
            });
        }
    },

    share : function(e){
        e.preventDefault();
        var output = this.outputs.get(e.target.getAttribute("data-output-id"));
        var _this = this;   
        this.phases.create({
            project           : this.project.get('id'),
            title             : output.get("title"),
            type              : "share",
            // start             : { type : "date"},
            // end               : { type : "date"},
            // inputs            : { collection : "Input", via : "phase"},
            following         : this.phase.get('id')
        }, {
            wait : true,
            success : function(model,response,options){
                _this.inputs.create({
                    project      : model.get('project'),
                    phase        : model.get('id'),
                    title        : output.get('title'),
                    content      : output.get('content'),
                    attachment   : output.get('attachment') 
                })
            }

        })

    },

    render : function(){
        $(this.el).empty();

        var contributions = _.groupBy(this.phase.get('results'), "tag");

        $(this.el).append(this.template({
            phase : this.phase.toJSON(),
            project : this.project.toJSON(),
            contributions : contributions
        }));
       
        return this;
    }
});


/////////////////////////////////////////////////////
// SHARE VIEW
/////////////////////////////////////////////////////
projectTimeline.Views.Phase_share = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.phase = json.phase;
        this.project = json.project;
        this.outputs = json.outputs;
        this.inputs = json.inputs;
        this.phases = json.phases;
        // Events
        // Templates
        this.template = JST["projectTimeline_share_template"];
    },
    events : {
        "click .createbs" : "createbs",
        "click .analyse" : "analyse"
    },


    analyse : function(e){
        e.preventDefault();
        var phase_id = e.target.getAttribute("data-phase-id");
        var _this = this;
        if(phase_id == this.phase.id){
            io.socket.get("/analyse/share_analyse?phase="+phase_id, function(response){
                _this.phase.set(response);
                _this.render();
            });
        }
    },


    createbs : function(e){
        e.preventDefault();
        var _this = this;
        var subject = prompt("Entrez un axe d'exploration");
        if (subject != null) {
            this.phases.create({
                project           : this.project.get('id'),
                title             : subject,
                type              : "brainstorming",
                // start             : { type : "date"},
                // end               : { type : "date"},
                // inputs            : { collection : "Input", via : "phase"},
                // following         : this.phase.get('id')
            })
        }
    },
    render : function(){
        $(this.el).empty();

        var contributions = _.groupBy(this.phase.get('results'), "tag");

        $(this.el).append(this.template({
            phase : this.phase.toJSON(),
            project : this.project.toJSON(),
            contributions : contributions
        }));
       
        return this;
    }
});


/////////////////////////////////////////////////////
// BRAINSTORMING VIEW
/////////////////////////////////////////////////////
projectTimeline.Views.Phase_brainstorming = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.phase = json.phase;
        this.project = json.project;
        this.outputs = json.outputs;
        this.inputs = json.inputs;
        this.phases = json.phases;
        this.contributions = json.contributions;
        // Events
        // Templates
        this.template = JST["projectTimeline_brainstorming_template"];
    },
    events : {
        "click .converge" : "converge"
    },

    converge : function(e){
        e.preventDefault();
        var _this = this;  
        var contribution = this.contributions.get(e.target.getAttribute("data-contribution-id")); 
        this.phases.create({
            project           : this.project.get('id'),
            title             : contribution.get("title"),
            type              : "converge",
            // start             : { type : "date"},
            // end               : { type : "date"},
            // inputs            : { collection : "Input", via : "phase"},
            following         : this.phase.get('id')
        }, {
            wait : true,
            success : function(model,response,options){
                _this.inputs.create({
                    project      : model.get('project'),
                    phase        : model.get('id'),
                    title        : contribution.get('title'),
                    content      : contribution.get('content'),
                    attachment   : contribution.get('attachment') 
                })
            }

        })

    },

    render : function(){
        $(this.el).empty();

        var contributions = this.phase.get('contributions');

        $(this.el).append(this.template({
            phase : this.phase.toJSON(),
            project : this.project.toJSON(),
            contributions : contributions
        }));
       
        return this;
    }
});


/////////////////////////////////////////////////////
// CONVERGENCE VIEW
/////////////////////////////////////////////////////
projectTimeline.Views.Phase_converge = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.phase = json.phase;
        this.project = json.project;
        this.outputs = json.outputs;
        this.inputs = json.inputs;
        this.phases = json.phases;
        // Events
        // Templates
        this.template = JST["projectTimeline_converge_template"];
    },
    events : {

    },

    render : function(){
        $(this.el).empty();

        var contributions = _.groupBy(this.phase.get('contributions'), "tag");

        $(this.el).append(this.template({
            phase : this.phase.toJSON(),
            project : this.project.toJSON(),
            contributions : contributions
        }));
       
        return this;
    }
});






