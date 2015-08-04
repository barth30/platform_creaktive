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

    // SELECTION DES BONNES COLLECTIONS ICI
    var phases = new global.Collections.Phase(global.collections.Phases.where({project : json.project.get('id')}));
    var organizations = new global.Collections.Organization(global.collections.Organizations.where({project : json.project.get('id')}));
    var inputs = new global.Collections.Input(global.collections.Inputs.where({project : json.project.get('id')}));
    var outputs = new global.Collections.Output(global.collections.Outputs.where({project : json.project.get('id')}));
    var contributions = new global.Collections.Contribution(global.collections.Contributions.where({project : json.project.get('id')}));
    var permissions = new global.Collections.Permission(global.collections.Permissions.where({project : json.project.get('id')}));

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
            console.log(exploration)
            var exp = new projectTimeline.Views.Phase_exploration({
                phase : exploration,
                phases : _this.phases,
                project : _this.project,
                outputs : _this.outputs,
                tagName : 'div',
                className : "row panel phase_exploration",
            });
            $(_this.el).append(exp.render().el);
            projectTimeline.views.explorations.push(exp);
        });

        // Ajout des vues Partage
        projectTimeline.views.share = [];
        _.each(phases_share, function(share){
            console.log(share)
            var exp = new projectTimeline.Views.Phase_exploration({
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
        this.phases.create({
            project           : this.project.get('id'),
            title             : output.get("title"),
            type              : "share",
            // start             : { type : "date"},
            // end               : { type : "date"},
            // inputs            : { collection : "Input", via : "phase"},
            following         : this.phase.get('id')
        }, {wait : true})

    },

    render : function(){
        $(this.el).empty();

        var contributions = _.groupBy(this.phase.get('contributions'), "tag");

        console.log(contributions)

        $(this.el).append(this.template({
            phase : this.phase.toJSON(),
            project : this.project.toJSON(),
            contributions : contributions
        }));
       
        return this;
    }
});






/////////////////////////////////////////////////
projectTimeline.Views.Form = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////

        this.model = json.model;
        this.users = json.users;
        this.organizations = json.organizations;
        this.phases = json.phases;
        this.permissions = json.permissions;

        this.selected_organizations = [];
        this.inputs_to_render = [];
        this.following = "";
        // Events
        $(this.el).attr('data-reveal', '');

        // Templates
        this.newPhase_form_template = JST["projectTimeline_newPhase_form_template"];
        this.form_orgs_template = JST["projectTimeline_newPhase_form_orgs_template"];
        this.form_date_template = JST["projectTimeline_newPhase_form_date_template"];
        this.form_following_template = JST["projectTimeline_newPhase_form_following_template"];
        this.form_inputs_template = JST["projectTimeline_newPhase_form_inputs_template"];
        this.form_nextprev_template = JST["projectTimeline_newPhase_form_nextprev_template"];
        this.newPhase_inputs_template = JST["projectTimeline_newPhase_inputs_template"]
        


    },
    events : {
        "click .new_phase" : "render",
        "click .new_phase_step2" : "new_phase_step2",
        "click .new_phase_complete" : "new_phase_form_complete",
        "click .add_organization" : "add_organization",
        "click .remove_organization" : "remove_organization",
        "click .add_input" : "add_input",
        "click .remove_input" : "remove_input"
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

    add_input : function(e){
        e.preventDefault();
        var title = $("#title").val();
        var content = $("#content").val();
        var files = $("#attachment")[0].files;
        
        var _this = this;


      global.Functions.uploadFile(files, function(files, param){
        if(files.length > 0){
             var new_input = new global.Models.Input({
                project      : _this.model.id,
                phase        : _this.new_phase.id,
                title        : title,
                content      : content,
                attachment   : files[0].fd
            });
            new_input.save(null, {
                success : function(model, response, options){
                    _this.inputs_to_render.push(new_input.toJSON());
                    _this.render_inputs();
                },
            });   
        }
        
        
      }); 

    },

    remove_input : function(e){
        e.preventDefault();

    },

    render_inputs : function(e){
        var container = $("#inputs_container");
        container.empty();
        container.append(this.newPhase_inputs_template({
            inputs : this.inputs_to_render
        }));
        $("#title").val("");
        $("#content").val("");
        $("#attachment").val("");
    },

    new_phase_step2 : function(e){
        e.preventDefault();
        var _this = this;
        this.new_phase = new global.Models.Phase({
            project       : this.model.get('id'),
            title         : $("#newPhase_title").val(),
            content       : $("#newPhase_content").val(),
            type          : $("#newPhase_type").val(),
            organizations : this.selected_organizations,
            inputs        : [],
            outputs       : [],
            contributions : [],
        });
        this.new_phase.save(null, {
            success : function(model, response, options){
                $(_this.el).empty();

                // En fonction de la phase précédente, on affiche les bons champs
                if(model.get("type") != "cadrage"){
                    $(_this.el).append(_this.form_following_template({
                        phases : _this.phases.toJSON()
                    }))
                    .append(_this.form_date_template())
                }

                $(_this.el).append(_this.form_inputs_template())
                .append(_this.form_nextprev_template({
                    next : "new_phase",
                    prev : "new_phase_complete"
                }))

                // Date Picker
                setTimeout(function() {
                    
                    $( "#start_date" ).datepicker({
                      // defaultDate: "+1w",
                      changeMonth: true,
                      numberOfMonths: 2,
                      onClose: function( selectedDate ) {
                        $( "#start_date" ).datepicker( "option", "minDate", selectedDate );
                      }
                    });
                    $( "#end_date" ).datepicker({
                      defaultDate: "+1w",
                      changeMonth: true,
                      numberOfMonths: 2,
                      onClose: function( selectedDate ) {
                        $( "#end_date" ).datepicker( "option", "maxDate", selectedDate );
                      }
                    }); 

                }, 0);

                $(document).foundation('abide', 'reflow');
            }
        })
    },

    new_phase_form_complete : function(e){
        e.preventDefault();
        var _this = this;
        //AJOUTER es différents input
        this.new_phase.save({
            following     : $("#newPhase_following").val(),
            start         : $("#newPhase_following").val(),
            end           : $("#newPhase_following").val(),
            inputs        : this.inputs_to_render
        },{
            success : function(model, response, options){
                _this.inputs_to_render.length = 0;
                $(_this.el).empty();
                _this.phases.add(_this.new_phase);
                delete _this.new_phase;
                $(_this.el).foundation('reveal', 'close');


                // Création des permissions et envoi des invitations
                model.get("organizations").each(function(org){
                    _.each(org.users, function(user){
                        _this.permissions.create({
                            user    : user.id,
                            project : _this.project.get('id'),
                            phase   : model.get('id')
                        })
                    });
                })
            }
        });       
    },

    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.newPhase_form_template());
        $(this.el).append(this.form_orgs_template({
            organizations : this.organizations.toJSON(),
            users         : this.users.toJSON()
        }));
        $(this.el).append(this.form_nextprev_template({
            prev : "",
            next : "new_phase_step2"
        }));
        
   
        return this;
    }
});



