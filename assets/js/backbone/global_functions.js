global.Functions.saveError = function(error){
    alert(error.summary);
};

global.Functions.uploadFile = function(files,cb){   

    //console.log(files);
    var data = new FormData();
    $.each(files, function(key, value)
    {
        data.append(key, value);
    });
    $.ajax({
        url: '/file/upload',
        type: 'POST',
        data: data,
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    }).success(function(data) {
        cb(data.files, data.params);
  }).error(function(jqXHR, textStatus, errorThrown){
      alert("Upload error, please try again later")
  });

}

/** 
* Fetch a set of collections
*/
global.Functions.fetchAll = function(collections, param, param_id, callback){


    if(param == "project"){
        async.each(collections, function(collection, cb){
            collection.fetch({
                data : {project : param_id},
                success : function(collection, response, options){
                    cb();
                },
                error : function(collection, response, options){
                    cb();
                }
            })

        },function(err){
            if(err) return callback(err);
            return callback();
        });
    }
    if(param == "phase"){
        async.each(collections, function(collection, cb){
            collection.fetch({
                data : {phase : param_id},
                success : function(collection, response, options){
                    cb();
                },
                error : function(collection, response, options){
                    cb();
                }
            })

        },function(err){
            if(err) return callback(err);
            return callback();
        });
    }




}