/*************************************/
var ck_dd = {
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
        //if(ck_dd.views.dds == undefined){
            ck_dd.views.dds = new ck_dd.Views.DDs({
                el : json.el,
                elements : global.collections.Elements,
            });
        //}
        ck_dd.views.dds.analyse();
    }
};
/***************************************/
ck_dd.Views.DDs = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.dd_analyses = [];
        this.elements = json.elements;
        // Templates
        
    },
    create_new_tagged_element : function(json,cb){
        var data = {
            type: json.type,
            title: json.title,
        }
        // on ajoute le tag en attribut de l'element
        data[json.prefix+json.tag] = json.tag;
        var newElement = ck_dd.views.dds.elements.newElement(data,cb);
    },
    analyse : function(){
        /////////////////////////////////////
        // CADRAGE KEYWORDS ANALYSE
        /////////////////////////////////////   
        $.post("/suggestion/analyse_dd_keywords",{
            elements : ck_dd.views.dds.elements.toJSON(),
        }, function(dd_per_keyword){
            ck_dd.views.dds.dd_analyses = dd_per_keyword;
            ck_dd.views.dds.render(dd_per_keyword);
        });
    },
    render : function(dd_per_keyword){
        $(this.el).empty();
        var _this = this;
        // each dd
        if(dd_per_keyword.length == 0){
            $(_this.el).append("<div class='row'>No keywords found</div>")
        }else{
            dd_per_keyword.forEach(function(dds){
                $(_this.el).append(new ck_dd.Views.DD({
                    element : dds.element,
                    dd : dds.dd
                }).render().el)
            })    
        }
        
    }

});
/***************************************/
ck_dd.Views.DD = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.element = json.element;
        this.dd = json.dd;
        // Templates
        this.dd_template = JST["ck-analyse-keywords-template"];
        this.header_template = JST["ck-header-perc-template"];
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
                ck_dd.views.dds.create_new_tagged_element(json);  
            }
        });
        //Create the element
        var json = {
            type : "knowledge",
            title : $(this.el).find("#"+tag+"_value").val(),
            tag : tag,
            prefix : "tag_"+_this.element.id+"_",
            cb : ck_dd.views.dds.analyse
        }
        ck_dd.views.dds.create_new_tagged_element(json); 
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
            sentence : "<p>Could be interesting to do the dominante design of <b>"+this.element.title+"</b></p>",
            perc : perc
        }));
        $(this.el).append(this.dd_template({
            keywords : this.dd
        }));

        return this;
    }
});
/***************************************/