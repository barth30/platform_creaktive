/***************************************/
// global.Collections.Comment = Backbone.Collection.extend({
//   model : global.Models.Comment,

//   initialize : function() {
//       this.url = "comment";
//       this.bind("error", function(model, error){
//           console.log( error );
//       });
//       _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
//       this.ioBind('create', this.serverCreate, this);
//       this.ioBind('update', this.serverUpdate, this);
//       this.ioBind('remove2', this.serverRemove, this);
//   },
//    serverCreate : function(model){
//   },
//   serverUpdate : function(model){

//   },
//   serverRemove : function(model){
//   },
// });