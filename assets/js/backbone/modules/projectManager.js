/////////////////////////////////////////////////
var projectManager = {
    // Classes
    Collections: {},
    Models: {},
    Views: {},
    // Instances
    collections: {},
    models: {},
    views: {},
    init: function (json) {
        if(!this.views.main){
            this.views.main = new projectManager.Views.Main({
                el : json.el,
                users : global.collections.Users, 
                user : global.models.current_user,
                display : json.display,
                projects : global.collections.Projects,
                phases : json.phases
            }); 
        };

        this.views.main.render();
    },
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
projectManager.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.users = json.users;
        this.user = json.user;
        this.projects = json.projects;
        this.display = json.display;
        this.phases = json.phases;
        // Events
        // Templates
        this.template_search = JST["projectManager_search_template"];

        this.listenTo(this.projects, "add", this.render);
        this.listenTo(this.projects, "remove", this.render);
    },
    events : {
        "keyup .search" : "search",
    },
    search : function(e){
        e.preventDefault();
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.projects.each(function(p){
            if(research.toLowerCase() == p.get('title').substr(0,research_size).toLowerCase()){
                matched.add(p);
            }
        });
        this.render_projects(matched);
    },
    render_projects : function(collection){
        var _this = this;
        var projects = this.projects;
        if(collection) projects = collection;
        var ws_class = "workspaces_container";
        ////////////////////////////
        if(this.display == "list") ws_class = "workspaces_container_list";
        else ws_class = "workspaces_container";
        $('.'+ws_class).remove();
        /////////////////
        var projects_container = $('<div>',{class:ws_class+' panel large-12 columns'});

           // Append ws to container
        projects.each(function(project){
            if(!projectManager.views[project.id]){
                projectManager.views[project.id] =  new projectManager.Views.Workspace({
                    display : _this.display,
                    model   : project,
                });
            }
            projects_container.append(projectManager.views[project.id].render().el)
        });

        // Append containers to el
        $(this.el).append(projects_container);


        if(this.display == "block") $(".workspaces_container").gridalicious({width: 300});

        $(document).foundation();
    },
    render : function(){        
        $(this.el).empty();

        $(this.el).append("<br>");        
        $(this.el).append(this.template_search({
            display : this.display
        }));

        //Création du formulaire
        if( !projectManager.views.form){
            projectManager.views.form = new projectManager.Views.Formulaire({
                tagName : "div",
                className : "reveal-modal",
                id : "new_ws_modal_"+this.display,
                projects : this.projects,
                user : this.user,
                phases : this.phases
            });
        };
        $(this.el).append(projectManager.views.form.render().el);
        
        //Création des vues pour les projets
        this.render_projects();

        group_module.init({
            id: "group_container",
            tagName : "div",
            className : "large-12 columns panel",
            organizations : global.collections.Organizations,
            users : global.collections.Users
          });

        $(this.el).append(group_module.views.organizations.el)

        $(document).foundation();
        return this;
    }
});

/////////////////////////////////////////////////
projectManager.Views.Formulaire = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.user = json.user;
        this.projects = json.projects;
        this.phases = json.phases;
        // Events
        // Templates
        $(this.el).attr('data-reveal', '');
        this.template_form = JST["projectManager_form_template"];
    },
    events : {
        "click .newProject" : "newProject"
    },
    newProject : function(e){
        e.preventDefault();
        var title = $(this.el).find('#wks_title').val();
        var description = $(this.el).find('#wks_description').val();
        var _this = this; 
        if(title != ""){
            this.projects.create({               
                title            : title,
                author           : this.user.id,
                permissions      : [],
                phases           : [],
                contributions    : [],
            }, { 
                wait : true,
                success : function(project){
                    _this.phases.create({
                        project           : project.get('id'),
                        title             : "Cadrage du projet",
                        type              : "cadrage",
                    },{
                        wait : true,
                        sucess : function(model, response, options){
                            window.location.href = "#project/" + project.id
                            $(_this.el).foundation('reveal', 'close');
                        }
                    })
                }

             });           
        }else{
            $('.alertBox').html('<div data-alert class="alert-box alert radius">Problem : title<a href="#" class="close">&times;</a></div>')
        }
        
    },
    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.template_form());
                
        return this;
    }
});
/////////////////////////////////////////////////
projectManager.Views.Workspace = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.display = json.display;
        this.model = json.model;
        // Events
        // Templates
        this.template_list = JST["projectManager_list_template"];
        this.template_block = JST["projectManager_block_template"];
    },
    events : {},
    render : function(){        
        $(this.el).empty();
        ////////////////////////////

        var _this = this;
 
        ////////////////////////////
        if(this.display == "list"){
            $(this.el).append(this.template_list({
                project : this.model.toJSON()
            }));
        }else{
            $(this.el).append(this.template_block({
                project : this.model.toJSON(),
            }));
        }        
        return this;
    }
});
/////////////////////////////////////////////////
