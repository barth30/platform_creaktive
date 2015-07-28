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