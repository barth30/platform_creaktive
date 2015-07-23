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
global.Collections.Group = Backbone.Collection.extend({
  model : global.Models.Group,

  initialize : function() {
      this.url = "group";
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
      this.url = "input";
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
      this.url = "output";
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
      this.url = "permission";
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
      this.url = "phase";
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
      this.url = "project";
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
      this.url = "user";
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

