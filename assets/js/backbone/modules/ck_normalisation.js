/*************************************/
var ck_normalisation = {
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
        //if(ck_normalisation.views.normalisation == undefined){
            ck_normalisation.views.normalisation = new ck_normalisation.Views.Normalisation({
                el : json.el,
                elements : global.collections.Elements,
                phase : json.phase
            });
        //}
        ck_normalisation.views.normalisation.analyse();
    }
};
/*************************************/
ck_normalisation.Views.Normalisation = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.normalisations = {};
        this.elements = json.elements;
        this.phase = json.phase;
        // Templates
        this.normalisation_template = JST['normalisation-template'];
        this.header_template = JST['ck-header-perc-template'];
        
    },
    events : {
        "change .template_selection" : "apply_template",
    },
    apply_template : function(e){
        e.preventDefault();
        var element = this.elements.get(e.target.getAttribute('data-id'));
        var value = $(e.target).find("option:selected").val();
        element.save({css_manu : value});
        this.analyse();
    },
    analyse : function(){
        var elements = this.elements.where({phase:this.phase.id});
        /////////////////////////////////////
        // STATUT
        /////////////////////////////////////   
        io.socket.post("/suggestion/get_statuts",{
            elements : elements,
        }, function(normalisations){
            ck_normalisation.views.normalisation.normalisations = normalisations;
            //console.log(normalisations)
            // STATUT
            var json = {
                c_normalized : [],
                k_normalized : [],
                c_not_normalized : [],
                k_not_normalized : []
            }
            normalisations.forEach(function(statut){
                // set the target
                var type = statut.element.type;
                if(statut.normalized){
                    if(type == "concept") json.c_normalized.push(statut);
                    if(type == "knowledge") json.k_normalized.push(statut);
                }else{
                    if(type == "concept") json.c_not_normalized.push(statut);
                    if(type == "knowledge") json.k_not_normalized.push(statut);
                }
            });
            ck_normalisation.views.normalisation.render(json);
        });
    },
    render : function(json){
        $(this.el).empty();
        // perc
        var all = (json.c_not_normalized.length + json.k_not_normalized.length + json.c_normalized.length + json.k_normalized.length);
        var done = json.c_normalized.length + json.k_normalized.length;
        var perc = Math.round(done*100/all);
        $(this.el).append(this.header_template({
            sentence : "Categorisation CK",
            perc : perc
        }));
        // other
        $(this.el).append(this.normalisation_template({
            anchor : "cnc",
            sentence : "Concepts no categorized",
            suggestions : json.c_not_normalized
        }));

        $(this.el).append(this.normalisation_template({
            anchor : "knc",
            sentence : "Knowledges no categorized",
            suggestions : json.k_not_normalized
        }));
    
        $(this.el).append(this.normalisation_template({
            anchor : "cc",
            sentence : "Concepts categorized",
            suggestions : json.c_normalized
        }));

        $(this.el).append(this.normalisation_template({
            anchor : "kc",
            sentence : "Knowledges categorized",
            suggestions : json.k_normalized
        }));
    }
});
/***************************************/