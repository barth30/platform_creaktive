/*************************************/
var ck_evaluation = {
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
        if(ck_evaluation.views.evaluation == undefined){
            ck_evaluation.views.evaluation = new ck_evaluation.Views.Evaluation({
                el : json.el,
                elements : global.collections.Elements,
                links : global.collections.Links,
                project : global.models.currentProject,
            });
        }
        ck_evaluation.views.evaluation.analyse();
    }
};
/***************************************/
ck_evaluation.Views.Evaluation = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.evaluations = [];
        this.elements = json.elements;
        this.links = json.links;
        this.project = json.project;
        // Templates
        this.explorations_template = JST["ck-explorations-template"];
        this.v2or_analyse_template = JST["ck-v2or-analyse-template"];
        this.header_template = JST["ck-header-perc-template"];
    },
    events : {},
    analyse : function(){
        $(this.el).empty();
        var _this = this;
        /////////////////////////////////////
        // EXPLORATION ANALYSE
        ///////////////////////////////////// 
        io.socket.post("/suggestion/get_explorations_analyse",{
            elements : _this.elements.toJSON(),
            links : _this.links.toJSON(),
        }, function(explorations){
            ck_evaluation.views.evaluation.render_explorations(explorations);
        });
        /////////////////////////////////////
        // RISK ANALYSE
        /////////////////////////////////////   
        io.socket.post("/suggestion/get_risk_analyse",{
            elements : _this.elements.toJSON(),
            links : _this.links.toJSON(),
        }, function(analyse){
            ck_evaluation.views.evaluation.render_risk_analyse(analyse);
        });
        /////////////////////////////////////
        // ORIGINALITY V2OR ANALYSE
        /////////////////////////////////////   
        io.socket.post("/suggestion/get_originality_v2or_analyse",{
            elements : _this.elements.toJSON(),
            links : _this.links.toJSON(),
        }, function(analyse){
            ck_evaluation.views.evaluation.render_v2or_analyse(analyse);
        });
        /////////////////////////////////////
        // VARIETY V2OR ANALYSE
        /////////////////////////////////////   
        io.socket.post("/suggestion/get_variety_v2or_analyse",{
            elements : _this.elements.toJSON(),
            links : _this.links.toJSON(),
        }, function(analyse){
            ck_evaluation.views.evaluation.render_v2or_analyse(analyse);
        });
        /////////////////////////////////////
        // VALUE V2OR ANALYSE
        /////////////////////////////////////   
        io.socket.post("/suggestion/get_value_v2or_analyse",{
            elements : _this.elements.toJSON(),
            links : _this.links.toJSON(),
        }, function(analyse){
            ck_evaluation.views.evaluation.render_v2or_analyse(analyse);
        });
        /////////////////////////////////////
        // STRENGTH V2OR ANALYSE
        /////////////////////////////////////   
        io.socket.post("/suggestion/get_strength_v2or_analyse",{
            elements : _this.elements.toJSON(),
            links : _this.links.toJSON(),
        }, function(analyse){
            ck_evaluation.views.evaluation.render_v2or_analyse(analyse);
        });

    },
    render_explorations : function(explorations){
        $(this.el).append(this.explorations_template({
            explorations : explorations
        }));
    },
    render_v2or_analyse : function(analyse){
        // perc
        var value = analyse.value;
        var all = 3;
        var done = analyse.value;
        var perc = Math.round(done*100/all);
        // color
        var color = "";
        if(value<=1) color = "alert";
        else if((value>1)&&(value<=2)) color = "";
        else if((value>2)&&(value<=3)) color = "success";
        // append
        $(this.el).append(this.v2or_analyse_template({
            analyse : analyse,
            perc : perc,
            color : color
        }));
    },
    render_risk_analyse : function(analyse){
        // perc
        var value = analyse.value;
        var all = 3;
        var done = analyse.value;
        var perc = Math.round(done*100/all);
        // color
        var color = "";
        if(value<=1) color = "success";
        else if((value>1)&&(value<=2)) color = "";
        else if((value>2)&&(value<=3)) color = "alert";
        // append
        $(this.el).append(this.v2or_analyse_template({
            analyse : analyse,
            perc : perc,
            color : color
        }));
    }
});

