/*************************************/
var ck_generator_frugal = {
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
        //if(ck_generator_frugal.views.dds == undefined){
            ck_generator_frugal.views.frugal = new ck_generator_frugal.Views.Frugal({
                el : json.el,
                elements : global.collections.Elements,
            });
        //}
        ck_generator_frugal.views.frugal.analyse();
    }
};
/***************************************/
ck_generator_frugal.Views.Frugal = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.dd_analyses = [];
        this.elements = json.elements;
        // Templates
        this.frugal_axes_template = JST["ck-frugal-axes"];
                
    },
    analyse : function(){
        io.socket.post("/suggestion/get_frugale_axes",{
            //elements : ck_generator_frugal.views.dds.elements.toJSON(),
            elements : ck_generator_frugal.views.frugal.elements,
            level : 2,
        }, function(axes){
            ck_generator_frugal.views.frugal.render(axes);
        });
    },
    render : function(axes){
        var _this = this;
        $(this.el).empty();

        axes.forEach(function(axe){
            $(_this.el).append(_this.frugal_axes_template({
                element : axe.element,
                axes : axe.axes,
                img : ""
            }));
           
        });
        //
        var img_google_templates = [];
        var axes_img = $(this.el).find(".googleImg");
        for(var i=0;i<axes_img.length;i++){
            //console.log(axes_img[i].getAttribute('data-search'));
            $(axes_img[i]).html(new googleSearch.Views.Main({
                term       : axes_img[i].getAttribute('data-search'),
                type       : "images",
                perpage    : 8,
                moreButton : true,
                width      : "100px",
            }).render().el);
        }
        // for(var i=0;i<axes_img.length;i++){
        //     setTimeout(function(){ 
        //         console.log(axes_img[i])
        //         $(axes_img[i]).append(img_google_templates[i]) 
        //     }, 3000);
        // }

        // 

        // setTimeout(function(){ $(_this.el).find('.tutu').append(a) }, 3000);

        
        $(document).foundation();
        return this;
    }
});
/***************************************/

