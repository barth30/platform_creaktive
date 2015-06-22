io.socket.on("connect", function(){
  Backbone.Model.prototype.toJSON = function() {
    return JSON.parse(JSON.stringify(this.attributes));
  };


  var json = {}; 
  global.init(json, function(){
    // Modules à lancer

    /*activat of "hashchange events's monitoring"*/
    if(!Backbone.History.started) Backbone.history.start();
    console.log("Backbone application started...")  
  });


}) ;