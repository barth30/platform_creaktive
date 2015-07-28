/*************************************/
var ck_localisation = {
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
        //if(ck_localisation.views.cadrage == undefined){
            ck_localisation.views.localisation = new ck_localisation.Views.Localisation({
                el : json.el,
                elements : global.collections.Elements,
                links : global.collections.Links,
                phase : json.phase
            });
        //}
        ck_localisation.views.localisation.analyse();
    }
};
/*************************************/
ck_localisation.Views.Localisation = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.localisations = {};
        this.phase = json.phase;
        this.links = json.links;
        this.elements = json.elements;
        // Templates
        this.localisation_template = JST['localisation-template'];
        this.header_template = JST['ck-header-perc-template'];
    },
    events : {
        "change .k_localisation" : "k_localisation",
    },
    k_localisation : function(e){
        e.preventDefault();
        var element = this.elements.get(e.target.getAttribute('data-id'));
        var value = $(e.target).find("option:selected").val();
        element.set({inside : value});
        element.save(null,{success:function(model, response, options){
            console.log("model:",model)
            ck_localisation.views.localisation.analyse();
        }})
        
    },
    analyse : function(){
        var elements = this.elements.where({phase:this.phase.id});
        console.log("elements:",elements)
        /////////////////////////////////////
        // LOCALISATION   
        /////////////////////////////////////   
        io.socket.post("/suggestion/get_localisations",{
            elements : elements,
            links : this.links.toJSON(),
        }, function(localisations){
            var auto = localisations.auto;
            var manu = localisations.manu;
            // AUTO
            auto.forEach(function(analyse){
                var k = ck_localisation.views.localisation.elements.get(analyse.knowledge.id);
                k.save({inside : analyse.inside});
            })
            // MANU
            var k_localized = [];
            var k_not_localized = [];
            manu.forEach(function(localisation){
                if(localisation.knowledge.inside != "") k_localized.push(localisation);
                else k_not_localized.push(localisation);
            });
            var json = {
                k_localized : k_localized,
                k_not_localized : k_not_localized
            }
            ck_localisation.views.localisation.render(json);
        });
    },
    render : function(json){
        $(this.el).empty();
        // perc
        var all = 10;
        var done = 1;
        var perc = Math.round(done*100/all);
        $(this.el).append(this.header_template({
            sentence : "Localisation de la connaissance",
            perc : perc
        }));
        // append
        $(this.el).append(this.localisation_template({
            anchor : "knl",
            sentence : "Knowledge not localized",
            suggestions : json.k_not_localized
        }));

        $(this.el).append(this.localisation_template({
            anchor : "kl",
            sentence : "Knowledge localized",
            suggestions : json.k_localized
        }));    
    }
});
/**************************************/