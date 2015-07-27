/***************************************/
global.Collections.Link = Backbone.Collection.extend({
  model : global.Models.Link,
  initialize : function() {
      this.url = "link";
      this.bind("error", function(model, error){
          console.log( error );
      });
      _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
  },
  newLink : function(json){
    var new_link = new global.Models.Link(json);
    //////////////////
    // si ya une boucle infinie avec ce nouveau lien
    var new_link = new global.Models.CKLink({
      user : global.models.current_user.get('id'),
      date : api.getDate(),
      project : global.models.currentProject.get('id')
    });
    new_link.save({success:function(link){
      // On l'ajoute à la collection
      global.collections.Links.add(link);   
      return link; 
    }});
  },
  serverCreate : function(model){
  },
  serverUpdate : function(model){
  },
  serverRemove : function(model){
  }
});
/***************************************/
global.Collections.Element = Backbone.Collection.extend({
  model : global.Models.Element,
  initialize : function() {
      this.url = "element";
      this.bind("error", function(model, error){
          console.log( error );
      });
      _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
  },
  newElement : function(json){
    var new_element = new global.Models.Element(json);
    // if no top or left define one
    if((json.top == undefined)||(json.left == undefined)){
        var elements = global.collections.Elements;
        var cadre = api.getCadre(global.collections.Links,elements,150);
        json.top = cadre.top_min;
        if(json.type != "concept"){
            json.left = cadre.left_max;    
        }else{
            json.left = cadre.left_min - 50;
        }
    }
    //
    if((global.models.current_project.get('id') != undefined)&&(global.models.current_user.get('id') == undefined)&&(global.models.current_phase.get('id'))){
      new_element.set({
        date : api.getDate(),
        id_father: "none",//father_id
        top : json.top,
        left : json.left,
        project : global.models.current_project.get('id'),
        user : global.models.current_user.get('id'),
        pahse : global.models.current_phase.get('id'),
        visibility : true,
        css_auto : "",
        css_manu : "",
        inside : ""
      });
      new_element.save({success : function(element){
        global.collections.Elements.add(element);
        return element;
      }});
    }
  },
  serverCreate : function(model){
  },
  serverUpdate : function(model){
  },
  serverRemove : function(model){
  }
});
/***************************************/
global.Collections.Contribution = Backbone.Collection.extend({
  model : global.Models.Contribution,

  initialize : function() {

      this.url = "contribution_module";

      this.bind("error", function(model, error){
          console.log( error );
      });
      _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
  },
   serverCreate : function(model){
  },
  serverUpdate : function(model){
  },
  serverRemove : function(model){
  }
});
/***************************************/
global.Collections.Organization = Backbone.Collection.extend({
  model : global.Models.Organization,

  initialize : function() {
      this.url = "/organization";
      this.bind("error", function(model, error){
          console.log( error );
      });
      _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
  },
   serverCreate : function(model){
  },
  serverUpdate : function(model){

  },
  serverRemove : function(model){
  },
});
/***************************************/
global.Collections.Input = Backbone.Collection.extend({
  model : global.Models.Input,

  initialize : function() {
      this.url = "/input";
      this.bind("error", function(model, error){
          console.log( error );
      });
      _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
  },
   serverCreate : function(model){
  },
  serverUpdate : function(model){

  },
  serverRemove : function(model){
  },
});

/***************************************/
global.Collections.Output = Backbone.Collection.extend({
  model : global.Models.Output,

  initialize : function() {
      this.url = "/output";
      this.bind("error", function(model, error){
          console.log( error );
      });
      _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
  },
   serverCreate : function(model){
  },
  serverUpdate : function(model){

  },
  serverRemove : function(model){
  },
});

/***************************************/
global.Collections.Permission = Backbone.Collection.extend({
  model : global.Models.Permission,

  initialize : function() {
      this.url = "/permission";
      this.bind("error", function(model, error){
          console.log( error );
      });
      _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
  },
   serverCreate : function(model){
  },
  serverUpdate : function(model){

  },
  serverRemove : function(model){
  },
});

/***************************************/
global.Collections.Phase = Backbone.Collection.extend({
  model : global.Models.Phase,

  initialize : function() {
      this.url = "/phase";
      this.bind("error", function(model, error){
          console.log( error );
      });
      _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
  },
   serverCreate : function(model){
  },
  serverUpdate : function(model){

  },
  serverRemove : function(model){
  },
});

/***************************************/
global.Collections.Project = Backbone.Collection.extend({
  model : global.Models.Project,

  initialize : function() {
      this.url = "/project";
      this.bind("error", function(model, error){
          console.log( error );
      });
      _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
  },
   serverCreate : function(model){
  },
  serverUpdate : function(model){

  },
  serverRemove : function(model){
  },
});

/***************************************/
global.Collections.User = Backbone.Collection.extend({
  model : global.Models.User,

  initialize : function() {
      this.url = "/user";
      this.bind("error", function(model, error){
          console.log( error );
      });
      _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
  },
   serverCreate : function(model){
  },
  serverUpdate : function(model){

  },
  serverRemove : function(model){
  },
});

