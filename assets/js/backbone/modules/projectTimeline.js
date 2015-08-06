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
    var phases = new global.Collections.Phase(global.collections.Phases.filter(function(obj){
        return obj.get('project').id == project.get('id')
    }));;
    var inputs = new global.Collections.Input(global.collections.Inputs.filter(function(obj){
        return obj.get('project').id == project.get('id')
    }));
    var outputs = new global.Collections.Output(global.collections.Outputs.filter(function(obj){
        return obj.get('project').id == project.get('id')
    }));
    var contributions = new global.Collections.Contribution(global.collections.Contributions.filter(function(obj){
        return obj.get('project').id == project.get('id')
    }));
    

    this.views.main = new projectTimeline.Views.Main({
        el : json.el,
        project : json.project,
        users : global.collections.Users,
        phases : phases,
        organizations : organizations,
        permissions : permissions,
        outputs : outputs,
        inputs : inputs,
        contributions : contributions
    });
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
projectTimeline.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.project = json.project;
        this.users = json.users;
        this.organizations = json.organizations;
        this.phases = json.phases;
        this.permissions = json.permissions;
        this.outputs = json.outputs;
        this.inputs = json.inputs;
        this.contributions = json.contributions;
        // Events
        // Templates
        this.template = JST["projectTimeline_template"];

        this.listenTo(this.phases, "add", this.render);
        this.listenTo(this.phases, "remove", this.render);
    },


    render : function(){
        $(this.el).empty();
        var _this = this;

        $(this.el).append(this.template({
            project : this.project.toJSON()
        }));

        var phase_cadrage = this.phases.findWhere({type : "cadrage"});//this.phases.get(_.findWhere(this.project.get('phases'), {type : "cadrage"}).id);

        var phases_exploration = this.phases.where({type : "exploration"});

        var phases_share = this.phases.where({type : "share"});

        // Ajout de la vue Cadrage
        projectTimeline.views.cadrage = new projectTimeline.Views.Phase_cadrage({
            phase : phase_cadrage,
            project : this.project,
            outputs : this.outputs,
            phases : this.phases,
            tagName : 'div',
            className : "row panel phase_cadrage",
        });
        $(this.el).append(projectTimeline.views.cadrage.render().el);

        // Ajout des vues Exploration
        projectTimeline.views.explorations = [];
        _.each(phases_exploration, function(exploration){
            var exp = new projectTimeline.Views.Phase_exploration({
                phase : exploration,
                phases : _this.phases,
                project : _this.project,
                outputs : _this.outputs,
                inputs :_this.inputs,
                tagName : 'div',
                className : "row panel phase_exploration",
            });
            $(_this.el).append(exp.render().el);
            projectTimeline.views.explorations.push(exp);
        });

        // Ajout des vues Partage
        projectTimeline.views.share = [];
        _.each(phases_share, function(share){
            var exp = new projectTimeline.Views.Phase_share({
                phase : share,
                phases : _this.phases,
                project : _this.project,
                outputs : _this.outputs,
                tagName : 'div',
                className : "row panel phase_share",
            });
            $(_this.el).append(exp.render().el);
            projectTimeline.views.share.push(exp);
        })


        // Formulaires 
        projectTimeline.views.org_form = new projectTimeline.Views.Organizations_form({
            tagName : "div",
            className : "reveal-modal",
            id : "add_org_modal",
            organizations : this.organizations,
            project : this.project,
            phases : this.phases  
        });
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
        "click .explore" : "explore"
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
        "click .share" : "share"
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
        // Events
        // Templates
        this.template = JST["projectTimeline_brainstorming_template"];
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






