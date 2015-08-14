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

    // SELECTION DES BONNES COLLECTIONS ICI
    this.collections.phases = new global.Collections.Phase(global.collections.Phases.filter(function(obj){
        return obj.get('project').id == project.get('id')
    }));;
    this.collections.inputs = new global.Collections.Input(global.collections.Inputs.filter(function(obj){
        return obj.get('project').id == project.get('id')
    }));
    this.collections.outputs = new global.Collections.Output(global.collections.Outputs.filter(function(obj){
        return obj.get('project').id == project.get('id')
    }));
    this.collections.contributions = new global.Collections.Contribution(global.collections.Contributions.filter(function(obj){
        return obj.get('project').id == project.get('id')
    }));
    this.collections.users = global.collections.Users;

    this.collections.organizations = global.collections.Organizations;

    global.Functions.fetchAll(this.collections,"project",project.id, function(err){
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
        
        this.users = projectTimeline.collections.users;
        this.organizations = projectTimeline.collections.organizations;
        this.phases = projectTimeline.collections.phases;
        this.permissions = projectTimeline.collections.permissions;
        this.outputs = projectTimeline.collections.outputs;
        this.inputs = projectTimeline.collections.inputs;
        this.contributions = projectTimeline.collections.contributions;
        // Events
        // Templates
        this.template = JST["projectTimeline_template"];

        this.listenTo(this.phases, "add", this.render);
        this.listenTo(this.phases, "remove", this.render);
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
        if(!projectTimeline.views.org_form){
            projectTimeline.views.org_form  = new projectTimeline.Views.Organizations_form({
                tagName : "div",
                className : "reveal-modal",
                id : "add_org_modal",
                organizations : this.organizations,
                project : this.project,
                phases : this.phases  
            });
        }
        $(this.el).append(projectTimeline.views.org_form.render().el);


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
projectTimeline.Views.Organizations_form = Backbone.View.extend({
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
        this.template = JST["projectTimeline_addOrg_template"];
    },
    events : {
        "click .add_organization" : "add_organization",
        "click .remove_organization" : "remove_organization"
    },

    add_organization : function(e){
        e.preventDefault();
        var org_id = e.target.getAttribute('data-org-id');
        this.selected_organizations.push(org_id);
        $("#"+org_id).removeClass("alert").removeClass("add_organization").addClass("remove_organization").addClass("success").html("Remove");
    },

    remove_organization : function(e){
        e.preventDefault();
        var org_id = e.target.getAttribute('data-org-id');
        this.selected_organizations = _.without(this.selected_organizations, org_id);
        $("#"+org_id).addClass("alert").addClass("add_organization").removeClass("remove_organization").removeClass("success").html("Add");
    },
    
    render : function(open){        
        $(this.el).empty();
        $(this.el).append(this.template({
            organizations : this.organizations.toJSON()
        }));
    
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
            io.socket.get("/analyse/cadrage_analyse?phase="+phase_id, function(response){
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
        "click .createbs" : "createbs"
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

        var contributions = _.groupBy(this.phase.get('contributions'), "tag");

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






