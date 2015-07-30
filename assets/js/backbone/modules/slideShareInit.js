////////////////////////////////////////
var slideShareInit = {
   // Classes
  Collections: {},
  Models: {},
  Views: {}, // model de view
  // Instances
  collections: {},
  models: {},
  views: {},
  //
  eventAggregator : global.eventAggregator,
  init : function(json){
      console.log($(json.el))
      slideShareInit.views.main = new slideShareInit.Views.Main({
        el : json.el,
        keywords : json.keywords,
        number : json.number
      });
      return slideShareInit.views.main;

  }
};
////////////////////////////////////////
slideShareInit.Views.Main = Backbone.View.extend({
  tagName: "div",
  className : "row",
  initialize: function(json){
    _.bindAll(this, 'render');
    // variables
    this.keywords = json.keywords
    this.number = json.number;
    this.main_slide = undefined;
    this.childs_slides = []; 
    // Template
    var _this = this;
    io.socket.post("/suggestion/get_slides_by_tag",{
       tagName : this.keywords,
       number : this.number,
        }, function(result){
          _this.main_slide = result.Tag.Slideshow[0];
          _this.childs_slides = result.Tag.Slideshow;
          _this.render_childs();
          _this.render_main();
        });
    }, 
    events: {
      "click changeSlide" : "changeMainSlide"
    },
  changeMainSlide : function(e){
    e.preventDefault();
    console.log(e)
    var id = e.target.getAttribute("data-id")
    console.log(id)
    this.main_slide = this.childs_slides[id]
    // get new main slide
    // set this.main_slide
    this.render_main();
  },
  render_main: function(){
    if(slideShareInit.views.mainslide == undefined){
      slideShareInit.views.mainslide = new slideShareInit.Views.MainSlide();
    }
    
      // MAIN SLIDE
      $(this.el).append(slideShareInit.views.mainslide.render().el);
    
  },
  render_childs: function(){
      // CHILDS SLIDES
      $(this.el).append(new slideShareInit.Views.ChildSlide({
        slides : this.childs_slides
      }).render().el);
  }

});
////////////////////////////////////////
slideShareInit.Views.MainSlide = Backbone.View.extend({
  tagName : "div",
  className : "large-12 medium-12 small-12 columns",
  id : "divMainSlide",
  initialize: function(json){
    _.bindAll(this, 'render');
    // variables
   // this.slide = slideShareInit.views.main.main_slide;
    // Template
  },
  render: function(){
    $(this.el).empty();
    var slide = slideShareInit.views.main.main_slide;
    // explode la slide pour recup just le ifram 
    //var slide_expl = this.slide.expl
    var slide_exploded = slide.Embed[0].split("<div",1) + "<li id='main'><center> "+slide.Title+"</center></li>";
    $(this.el).append(slide_exploded);
    return this; 
  }
});
////////////////////////////////////////
slideShareInit.Views.ChildSlide = Backbone.View.extend({
  tagName : "div",
  className : "sm large-12 medium-12 small-12 columns",
  initialize: function(json){
    _.bindAll(this, 'render');
    // variables
    this.slides = json.slides;
  },
  render: function(){
    $(this.el).empty();
    var _this = this;
    var i = 0
    this.slides.forEach(function(slide){
      var slide_exploded = slide.Embed[0].split("<div",1) + "<a href='#' class='button tiny changeSlide' data-id='"+i+"'> "+slide.Title+"</a>";
      var template = '<div class="large-4 medium-4 small-4 columns text-center" style="heigth : 200px;">'+slide_exploded+'</div>';
      $(_this.el).append(template)
      i = i + 1;
    });
    return this;
  }
});
////////////////////////////////////////