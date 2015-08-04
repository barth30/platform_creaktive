/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `FileController.upload()`
   */
  upload: function (req, res) {
    console.log("Sending file S3")
    req.file("0").upload({
      adapter: require('skipper-s3'),
      key: 'AKIAIK5NKF7MSBBB4EGQ',
      secret: '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',
      bucket: 'creaktivetestplatform'   
    },function whenDone(err, uploadedFiles) {
      if (err) return console.log(err);
      else {
        console.log("fichier envoyé")
        return res.ok({
          files: uploadedFiles,
          textParams: req.params.all()
        })
      }
    });
   // S3Service.pushFile(req.file("0"), function(err, data){
   //      if(err) return res.send({err:err});
   //      res.send({amz_id : data})
   //  });
  },


  /**
   * `FileController.remove()`
   */
  remove: function (req, res) {
    return res.json({
      todo: 'remove() is not implemented yet!'
    });
  },


  /**
   * `FileController.edit()`
   */
  edit: function (req, res) {
    return res.json({
      todo: 'edit() is not implemented yet!'
    });
  }
};

