/*************************************/
var ck_exploration = {
    // Classes
    Collections: {},
    Models: {},
    Views: {},
    // Instances
    collections: {},
    models: {},
    views: {},

    eventAggregator : global.eventAggregator,
    ///////////////////////
    init: function (json) {

        var phase = global.models.current_phase;

        var organizations = new global.Collections.Organization(global.collections.Organizations.where({phase : phase.get('id')}));
        var inputs = new global.Collections.Input(global.collections.Inputs.where({phase : phase.get('id')}));
        var outputs = new global.Collections.Output(global.collections.Outputs.where({phase : phase.get('id')}));
        var contributions = new global.Collections.Contribution(global.collections.Contributions.where({phase : phase.get('id')}));



        //if(ck_exploration.views.dds == undefined){
            ck_exploration.views.dds = new ck_exploration.Views.DDs({
                el : json.el,
                elements : global.collections.Elements,
                phase : phase,
                outputs : outputs,
                contributions : contributions
            });
        //}
        ck_exploration.views.dds.analyse();
    }
};
/***************************************/
ck_exploration.Views.DDs = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.dd_analyses = [];
        this.elements = json.elements;
        this.phase = json.phase;
        this.outputs = json.outputs;
        this.contributions = json.contributions;
        // Templates
                
    },
    create_new_tagged_element : function(json,cb){
        var data = {
            type: json.type,
            title: json.title,
        }
        // on ajoute le tag en attribut de l'element
        data[json.prefix+json.tag] = json.tag;
        var newElement = ck_exploration.views.dds.elements.newElement(data,cb);
    },
    analyse : function(){
        /////////////////////////////////////
        // CADRAGE KEYWORDS ANALYSE
        /////////////////////////////////////   
        io.socket.post("/suggestion/analyse_dd_keywords",{
            elements : ck_exploration.views.dds.elements.toJSON(),
        }, function(dd_per_keyword){
            ck_exploration.views.dds.dd_analyses = dd_per_keyword;
            ck_exploration.views.dds.render(dd_per_keyword);
        });
    },
    render : function(dd_per_keyword){
        $(this.el).empty();
        var _this = this;
        // each dd
        // if(dd_per_keyword.length == 0){
        //     $(_this.el).append("<div class='row'>No keywords found</div>")
        // }else{
        //     dd_per_keyword.forEach(function(dds){
        //         $(_this.el).append(new ck_exploration.Views.DD({
        //             element : dds.element,
        //             dd : dds.dd
        //         }).render().el)
        //     })    
        // }


        // Un truc méga foireux pour afficher un seul dominant design...
        dd_per_keyword.forEach(function(dds){
            if(dds.element.title == _this.phase.get("title")){
                $(_this.el).append(new ck_exploration.Views.DD({
                    element : dds.element,
                    dd : dds.dd,
                    phase : _this.phase,
                    outputs : _this.outputs,
                    contributions : _this.contributions
                }).render().el)    
            }
        })   



        $(document).foundation();
        
    }

});
/***************************************/
ck_exploration.Views.DD = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.element = json.element;
        this.dd = json.dd;
        this.phase = json.phase;
        this.outputs = json.outputs;
        this.contributions = json.contributions;
        // Templates
        this.header_template = JST["ck-header-perc-template"];
        this.dd_layout_template = JST["ck-dd-tabs-layout"];
    },
    render : function(){
        $(this.el).empty();
        // perc
        var all = this.dd.length;
        var done = 0;
        this.dd.forEach(function(analyse){
            if(analyse.tagged.length > 0) done++;
        });
        var perc = Math.round(done*100/all);
        // Append
        $(this.el).append(this.header_template({
            sentence : "<p>Exploration de l'axe de travail : <b>"+this.element.title+"</b></p>",
            perc : perc
        }));

        //  // layout tabs
        // $(this.el).append(this.dd_layout_template({
        //     element : this.element
        // }));
        // // TAB CONTENT
        // $(this.el).append(new ck_exploration.Views.TabContent({
        //     element : this.element,
        //     dd : this.dd
        // }).render().el);
        
        // $(this.el).append("<hr>");
        // $(document).foundation();
        // return this;

        // Document upload view
        $(this.el).append(new ck_exploration.Views.UploadDoc({
            tagName : "div",
            className : "large-12 columns",
            phase : this.phase,
            outputs : this.outputs
        }).render().el);

        // keyword analyse
        $(this.el).append(new ck_exploration.Views.Questions({
            tagName : "div",
            className : "large-12 columns",
            id : "ck-dd-q"+this.element.id,
            dd : this.dd,
            element : this.element,
            phase : this.phase,
            contributions : this.contributions
        }).render().el);

        // Forum ????

        // layout tabs
        $(this.el).append(this.dd_layout_template({
            element : this.element
        }));
        // TAB CONTENT
        $(this.el).append(new ck_exploration.Views.TabContent({
            element : this.element,
            dd : this.dd
        }).render().el);
        
        $(this.el).append("<hr>");
        $(document).foundation();
        return this;
    }
});
/***************************************/
ck_exploration.Views.Questions = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.dd = json.dd;
        this.element = json.element;
        this.phase = json.phase;
        this.contributions = json.contributions;
        // Templates
        this.dd_template = JST["ck-analyse-keywords-template"];
        $(this.el).attr({role:"tabpanel"});
    },
    events : {
        "click .new_cadrage" : "new_dd_element", 
    },
    new_dd_element : function(e){
        e.preventDefault();
        var tag = e.target.getAttribute('data-tag');
        // // create poche if needed
        var _this = this;
        this.dd.forEach(function(analyse){
            if((analyse.tag == tag)&&(analyse.poche == undefined)){
                var json = {
                    type : "poche",
                    title : analyse.title.fr+" / "+analyse.title.en,
                    prefix : "tag_"+_this.element.id+"_",
                    tag : analyse.tag,
                }
                ck_exploration.views.dds.create_new_tagged_element(json);  
            }
        });
        //Create the element
        var json = {
            type : "knowledge",
            title : $(this.el).find("#"+tag+"_value").val(),
            tag : tag,
            prefix : "tag_"+_this.element.id+"_",
            cb : ck_exploration.views.dds.analyse
        }
        ck_exploration.views.dds.create_new_tagged_element(json); 

        // On créé la contribution -_-'
        this.contributions.create({
            project      : this.phase.get('project').id,
            phase        : this.phase.get('id'),
            user         : global.models.current_user.get('id'),
            title        : json.title,
            tag          : json.tag
        });

        this.render();

    },
    render : function(dd_per_keyword){
        $(this.el).empty();

        $(this.el).append(this.dd_template({
            keywords : this.dd
        }));

        return this;
    }

});
/***************************************/
ck_exploration.Views.UploadDoc = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.outputs = json.outputs;
        this.phase = json.phase;
        // Templates
        this.template = JST["ck-exploration-uploadDoc-template"];

    },
    events : {
        "click .upload" : "upload"
    },

    upload : function(e){
        e.preventDefault();
        var title = $("#title").val();
        var content = $("#content").val();
        var files = $("#attachment")[0].files;
        
        var _this = this;


      global.Functions.uploadFile(files, function(files, param){
        if(files.length > 0){
             _this.outputs.create({
                project      : _this.phase.get("project"),
                phase        : _this.phase.get('id'),
                title        : title,
                content      : content,
                attachment   : files[0].fd
            }, {
                success : function(model, response, options){
                    var phase_outputs = _this.phase.get("outputs");
                    phase_outputs.push(model.toJSON());
                    _this.phase.save();
                    $("#outputs_container").append("<li>"+model.get("title")+"</li>");   
                },
            });  
        }  
      }); 
    },


    render : function(dd_per_keyword){
        $(this.el).empty();
        $(this.el).append(this.template({
            outputs : this.outputs.toJSON()
        }))
        return this;
    }
});

/***************************************/
ck_exploration.Views.TabContent = Backbone.View.extend({
    tagName : "div",
    className : "tabs-content large-12 columns",
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.element = json.element;
        this.dd = json.dd;
        // Templates
        
    },
    render : function(dd_per_keyword){

        // SLIDESHARE
        $(this.el).append(new ck_exploration.Views.SectionSlideShare({
            tagName : "section",
            className : "content panel active",
            id : "ck-dd-s"+this.element.id,
            dd : this.dd,
            element : this.element
        }).render().el);
        // Google Images
        $(this.el).append(new ck_exploration.Views.SectionGoogleApi({
            tagName : "section",
            className : "content panel",
            id : "ck-dd-i"+this.element.id,
            dd : this.dd,
            settings : {
                term       : this.element.title,
                mode       : this.mode,
                type       : "images",
                perpage    : 8,
                moreButton : true,
                width      : "150px",
            }        
        }).render().el);
        // Google news
        $(this.el).append(new ck_exploration.Views.SectionGoogleApi({
            tagName : "section",
            className : "content panel",
            id : "ck-dd-n"+this.element.id,
            dd : this.dd,
            settings : {
                term       : this.element.title,
                mode       : this.mode,
                type       : "news",
                perpage    : 5,
                moreButton : true,
                width      : "150px",
            }
        }).render().el);
        // Google web
        $(this.el).append(new ck_exploration.Views.SectionGoogleApi({
            tagName : "section",
            className : "content panel",
            id : "ck-dd-w"+this.element.id,
            dd : this.dd,
            settings : {
                term       : this.element.title,
                mode       : this.mode,
                type       : "web",
                perpage    : 5,
                moreButton : true,
                width      : "150px",
            }
        }).render().el);
        // Google video
        $(this.el).append(new ck_exploration.Views.SectionGoogleApi({
            tagName : "section",
            className : "content panel",
            id : "ck-dd-v"+this.element.id,
            dd : this.dd,
            settings : {
                term       : this.element.title,
                mode       : this.mode,
                type       : "video",
                perpage    : 5,
                moreButton : true,
                width      : "150px",
            }
        }).render().el);
        
        // $(this.el).find("#ck-dd-q"+this.element.id).append(this.dd_template({
        //     keywords : this.dd
        // }));
        // slideShare
        //slideShareInit.init({el:"#ck-dd-s"+this.element.id, keywords:this.element.title,number:3});
        $(document).foundation();

        //$(this.el).empty();
        return this;
    }

});

/***************************************/
ck_exploration.Views.SectionSlideShare = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.element = json.element;
        // Templates
        $(this.el).attr({role:"tabpanel"});
    },
    render : function(dd_per_keyword){
        $(this.el).empty();
        $(this.el).append(slideShareInit.init({
            // el:"#"+this.id,
            keywords:this.element.title,
            number:3
        }).el);
        return this;
    }
});
/***************************************/
ck_exploration.Views.SectionGoogleApi = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.settings = json.settings;
        // Templates
        $(this.el).attr({role:"tabpanel"});
        $(this.el).css("padding","10px");
    },
    render : function(dd_per_keyword){
        $(this.el).empty();
        $(this.el).append(new googleSearch.Views.Main(this.settings).render().el);
        return this;
    }
});
/***************************************/

