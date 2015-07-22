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
    this.views.main = new projectManager.Views.Main({
        el : json.el,
        users : global.collections.Users, 
        user : global.models.current_user,
        display : json.display,
        projects : global.collections.Projects,
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
projectManager.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.users = json.users;
        this.user = json.user;
        this.projects = json.projects;
        this.display = json.display;
        // Events
        // Templates
        this.template_search = JST["projectManager_search_template"];
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
            projects_container.append(new projectManager.Views.Workspace({
                display : _this.display,
                model   : project,
            }).render().el)
        })

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
    
        $(this.el).append(new projectManager.Views.Formulaire({
            tagName : "div",
            className : "reveal-modal",
            id : "new_ws_modal_"+this.display,
            projects : this.projects,
            user : this.user
        }).render().el);
        this.render_projects();

        // if(this.display != "list"){
            
        // }

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
        // Events
        // Templates
        $(this.el).attr('data-reveal', '');
        this.template_form = JST["projectManager_form_template"];
    },
    events : {
        "click .newWorkspace" : "newWorkspace"
    },
    newWorkspace : function(e){
        e.preventDefault();
        var title = $(this.el).find('#wks_title').val();
        var description = $(this.el).find('#wks_description').val();
        var organisation = $(this.el).find('#wks_organisation').val();
        var visibility = $(this.el).find('#wks_visibility').val();
        if(title != ""){
            var id = guid();
            new_workspace = new global.Models.ProjectModel({
                id:id,
                author : this.user,
                title: title,
                date: getDate(),
                date2:new Date().getTime(),
                image:"",
                content : description,
                backup:false,
                project:id,
                status : visibility
                //kLabels : [{color : "#27AE60", label:"Validated"},  {color : "#F39C12", label:"Processing"}, {color : "#C0392B", label:"Missing"}],
                //cLabels : [{color : "#27AE60", label:"Known"}, {color : "#F39C12", label:"Reachable"}, {color : "#C0392B", label:"Alternative"}]
            });
            new_workspace.save();
            this.projects.add(new_workspace);
            setTimeout(function(){ 
                window.location.href = "/bbmap?projectId="+new_workspace.get('id');
            }, 500);  
            
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
