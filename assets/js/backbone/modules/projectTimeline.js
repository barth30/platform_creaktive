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
    this.views.main = new projectTimeline.Views.Main({
        el : json.el,
        project : json.project,
        users : json.users,
        organizations : json.organizations,
        phases : json.phases
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
        this.model = json.project;
        this.users = json.users;
        this.organizations = json.organizations;
        this.phases = json.phases;
        // Events
        // Templates
        this.template = JST["projectTimeline_template"];

        this.listenTo(this.phases, "add", this.render);
        this.listenTo(this.phases, "remove", this.render);
    },
    events : {

    },

    render_phases : function(){
        var container = $("#phases_container");

        this.phases.each(function(phase){
            container.append(new projectTimeline.Views.Phase({
                model : phase
            }).render().el)
        });
        $(document).foundation();
    },

    render : function(){        
        $(this.el).empty();

        $(this.el).append(this.template({
            project : this.model.toJSON()
        }));

        $(this.el).append(new projectTimeline.Views.Form({
            tagName : "div",
            className : "reveal-modal",
            id : "newPhase_modal",
            model : this.model,
            users : this.users,
            organizations : this.organizations,
            phases : this.phases,
            user : this.user
        }).render().el);
        
        this.render_phases();

        $(document).foundation();
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
        // Events
        $(this.el).attr('data-reveal', '');

        // Templates
        this.newPhase_form_template = JST["projectTimeline_newPhase_form_template"];
        this.newPhase_form2_template = JST["projectTimeline_newPhase_form2_template"];
        this.newPhase_form3_template = JST["projectTimeline_newPhase_form3_template"];
        

    },
    events : {
        "click .new_phase" : "render",
        "click .new_phase_step2" : "new_phase_form2",
        "click .new_phase_step3" : "new_phase_form3",
        "click .new_phase_complete" : "new_phase_complete"
    },
    new_phase_form2 : function(e){
        e.preventDefault();
        this.new_phase = new global.Models.Phase({
                project       : this.model.get('id'),
                title         : $("#newPhase_title").val(),
                content       : $("#newPhase_content").val(),
                start         : $("#start_date").val(),
                end           : $("#end_date").val(),
                inputs         : [],
                outputs        : [],
                contributions : []
        });
        this.new_phase.save();
        $(this.el).empty();
        $(this.el).append(this.newPhase_form2_template({
            organizations : this.organizations.toJSON(),
            users : this.users.toJSON()
        }));
    },

    new_phase_form3 : function(e){
        e.preventDefault();
        //AJOUTER es différents groupes
        var selected_organizations = [];
        this.organizations.each(function(org){
            if($('#'+org.id).val() == "on"){
                selected_organizations.push(org.id);
            }
        });

        this.new_phase.save({
            organizations : selected_organizations
        });
        selected_organizations.length = 0;
        $(this.el).empty();
        $(this.el).append(this.newPhase_form3_template());
    },

    new_phase_complete : function(e){
        e.preventDefault();
        //AJOUTER es différents input
        this.new_phase.save({
            input : []
        });
        $(this.el).empty();
        this.add(this.new_phase);
        delete this.new_phase;
        $(this.el).append("<div>Nouvelle phase ajoutée</div>");
    },

    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.newPhase_form_template());       
        return this;
    }
});


projectTimeline.Views.Phase = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.model = json.model;
        // Events
        // Templates
        this.template = JST["projectTimeline_phase_template"];
    },
    events : {

    },

    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.template({phase : this.model.toJSON()}));
       
        return this;
    }
});