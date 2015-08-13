
var exploration = {

  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  eventAggregator: global.eventAggregator,


  init: function (json) {
    // if (exploration.views.contributions == undefined) {

      var phase = json.phase;
      var contributions = new global.Collections.Contribution(global.collections.Contributions.filter(function(contribution){
        return contribution.get('phase').id == phase.get('id')
      }));
      var outputs = new global.Collections.Output(global.collections.Outputs.filter(function(output){
        return output.get('phase').id == phase.get('id')
      }));
      //console.log(contributions.toJSON());
      if(!this.views[phase.id]){
        this.views[phase.id] = new this.Views.Main({
          el: json.el,
          users: json.users,
          contributions: contributions,
          outputs: outputs,
          phase : phase
        });
      }

    // }
    this.views[phase.id].render()
  }
};

///////////////////////////////////
//CONTRIBUTIONS
///////////////////////////////////
exploration.Views.Main = Backbone.View.extend({

  initialize: function (json) {
    _.bindAll(this, "render");
    this.el = json.el;
    this.contributions = json.contributions;
    this.phase = json.phase;
    this.outputs = json.outputs;


    this.dd_template = JST['ck-dd-tabs-layout'];

    this.contributions.on("add", this.render, this);
    this.contributions.on("remove", this.render, this);
    
    this.outputs.on("add", this.render, this);
    this.outputs.on("remove", this.render, this);
    
  },


  render: function () {
    $(this.el).empty();
    var _this = this;

  
    if(!exploration.views[this.phase.id].tab){
      exploration.views[this.phase.id].tab = new exploration.Views.Tab({
        tagName : "div",
        className : "large-12 columns",
        users: _this.users,
        contributions: _this.contributions,
        phase : _this.phase
      });
    };

    if(!exploration.views[this.phase.id].outputs_view){
       exploration.views[this.phase.id].outputs_view = new exploration.Views.Outputs({
         tagName : "div",
          className : "large-12 columns",
          outputs: _this.outputs,
          phase : _this.phase
        });
    }


    if(!exploration.views[this.phase.id].tabs_content){
      exploration.views[this.phase.id].tabs_content = new exploration.Views.TabContent({
          phase : this.phase
      })
    }


     $(_this.el).append(exploration.views[this.phase.id].outputs_view.render().el);
     
     $(_this.el).append(exploration.views[this.phase.id].tab.render().el);

     $(this.el).append(this.dd_template({element : this.phase.toJSON()}));
     
     $(_this.el).append(exploration.views[this.phase.id].tabs_content.render().el);


        return this;

  }

});


exploration.Views.Tab = Backbone.View.extend({
  initialize: function (json) {
    _.bindAll(this, "render");

    this.users = json.users;
    this.contributions = json.contributions;
    this.phase = json.phase;
    this.template = JST["exploration_tab_template"];
    
    this.tab = _.groupBy(this.contributions.toJSON(), "tag");
    
  },

  events : {
    "click .answer" : "answer"
  },
 

  answer : function(e){
    e.preventDefault();
    var tag = e.target.getAttribute("data-question-tag");

    var answer = $("#contributionTextField"+tag).val();
    this.contributions.create({
      project: this.phase.get('project').id,
      phase: this.phase.get('id'),
      content: answer,
      user: global.models.current_user,
      tag : tag
    });
  },
  render: function () {
    $(this.el).empty();

    $(this.el).append(this.template({
      business : this.tab["Business"],
      uv : this.tab["UV"],
      uk: this.tab["UK"],
      tk: this.tab["TK"]
    }));

    return this;
  }
});

exploration.Views.Outputs = Backbone.View.extend({
  initialize: function (json) {
    _.bindAll(this, "render");

    this.users = json.users;
    this.phase = json.phase;
    this.outputs = json.outputs;
    this.template = JST["exploration_output_template"];
    this.templateAccordion = JST["exploration_accordion_template"];
  },

  events : {
    "click .answer" : "answer"
  },

  answer : function(e){
 e.preventDefault();
        var title = $("#titre").val();
        var content = $("#description").val();
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
  render: function () {
    $(this.el).empty();
   
    $(this.el).append(this.template({
     outputs : this.outputs.toJSON()
    }));

    $(this.el).append(this.templateAccordion({
     outputs : this.outputs.toJSON()
    }));

    return this;
  }
});

/***************************************/
exploration.Views.TabContent = Backbone.View.extend({
    tagName : "div",
    className : "tabs-content large-12 columns",
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.phase = json.phase;
        // Templates
        
    },
    render : function(dd_per_keyword){

        // Google web
        $(this.el).append(new exploration.Views.SectionGoogleApi({
            tagName : "section",
            className : "content panel active",
            id : "ck-dd-w"+this.phase.id,
            settings : {
                term       : this.phase.get('title'),
                mode       : this.mode,
                type       : "web",
                perpage    : 5,
                moreButton : true,
                width      : "150px",
            }
        }).render().el);

        // SLIDESHARE
        $(this.el).append(new exploration.Views.SectionSlideShare({
            tagName : "section",
            className : "content panel",
            id : "ck-dd-s"+this.phase.id,
            phase : this.phase
        }).render().el);
        // Google Images
        $(this.el).append(new exploration.Views.SectionGoogleApi({
            tagName : "section",
            className : "content panel",
            id : "ck-dd-i"+this.phase.id,
            settings : {
                term       : this.phase.get('title'),
                mode       : this.mode,
                type       : "images",
                perpage    : 8,
                moreButton : true,
                width      : "150px",
            }        
        }).render().el);
        // Google news
        $(this.el).append(new exploration.Views.SectionGoogleApi({
            tagName : "section",
            className : "content panel",
            id : "ck-dd-n"+this.phase.id,
            settings : {
                term       : this.phase.get('title'),
                mode       : this.mode,
                type       : "news",
                perpage    : 5,
                moreButton : true,
                width      : "150px",
            }
        }).render().el);
        // Google video
        $(this.el).append(new exploration.Views.SectionGoogleApi({
            tagName : "section",
            className : "content panel",
            id : "ck-dd-v"+this.phase.id,
            settings : {
                term       : this.phase.get('title'),
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
exploration.Views.SectionSlideShare = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.phase = json.phase;
        // Templates
        $(this.el).attr({role:"tabpanel"});
    },
    render : function(dd_per_keyword){
        $(this.el).empty();
        $(this.el).append(slideShareInit.init({
            // el:"#"+this.id,
            keywords:this.phase.get('title'),
            number:3
        }).el);
        return this;
    }
});
/***************************************/
exploration.Views.SectionGoogleApi = Backbone.View.extend({
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

