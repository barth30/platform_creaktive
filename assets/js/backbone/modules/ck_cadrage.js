/*************************************/
var ck_cadrage = {
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
        //if(ck_cadrage.views.cadrage == undefined){
            ck_cadrage.views.cadrage = new ck_cadrage.Views.Cadrage({
                el : json.el,
                elements : global.collections.Elements,
            });
        //}
        ck_cadrage.views.cadrage.analyse();
    }
};
/*************************************/
ck_cadrage.Views.Cadrage = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.cadrage_analyses = [];
        this.elements = json.elements;
        // Templates
        this.cadrage_template = JST["ck-analyse-keywords-template"];
        this.header_template = JST["ck-header-perc-template"];
        // Events
    },
    events : {
        "click .new_cadrage" : "new_cadrage_keywords", 
    },
    create_new_tagged_element : function(json,cb){
        var data = {
            type: json.type,
            title: json.title,
        }
        // on ajoute le tag en attribut de l'element
        data[json.prefix+json.tag] = json.tag;
        var newElement = ck_cadrage.views.cadrage.elements.newElement(data,cb);
    },
    new_cadrage_keywords : function(e){
        e.preventDefault();
        var tag = e.target.getAttribute('data-tag');
        // create poche if needed
        this.cadrage_analyses.forEach(function(analyse){
            if((analyse.tag == tag)&&(analyse.poche == undefined)){
                var json = {
                    type : "poche",
                    title : analyse.title.fr+" / "+analyse.title.en,
                    tag : analyse.tag,
                    prefix : "tag_"
                }
                ck_cadrage.views.cadrage.create_new_tagged_element(json);
            }
        });
        // Create the element
        var json = {
            type : "knowledge",
            title : $("#"+tag+"_value").val(),
            tag : tag,
            prefix : "tag_"
        }
        ck_cadrage.views.cadrage.create_new_tagged_element(json,function(){ck_cadrage.views.cadrage.analyse();});
    },
    analyse : function(){
        /////////////////////////////////////
        // CADRAGE KEYWORDS ANALYSE
        /////////////////////////////////////   
        io.socket.post("/suggestion/analyse_cadrage_keywords",{
            elements : ck_cadrage.views.cadrage.elements.toJSON(),
        }, function(analyses){
            ck_cadrage.views.cadrage.cadrage_analyses = analyses;
            ck_cadrage.views.cadrage.render(analyses);
        });
    },
    render : function(analyses){
        $(this.el).empty();
        // perc
        var all = analyses.length;
        var done = 0;
        analyses.forEach(function(analyse){
            if(analyse.tagged.length > 0) done++;
        });
        var perc = Math.round(done*100/all);
        $(this.el).append(this.header_template({
            sentence : "Cadrage de la problématique",
            perc : perc
        }));
        // append
        $(this.el).append(this.cadrage_template({
            keywords : analyses
        }));
    }

});