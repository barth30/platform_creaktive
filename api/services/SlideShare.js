var slideshare = require('slideshare');

module.exports = {
	get_slides_by_user : function(user,number,cb){
		var ss = new slideshare('K4UCWZUD', 'yWROGQx3');
		ss.getSlideshowsByUser(user, { limit: number, detailed: 0 }, function(result) {
		    if(cb)cb(result);
		});
	},
	get_slides_by_tag : function(tag,number,cb){
		var ss = new slideshare('K4UCWZUD', 'yWROGQx3');
		ss.getSlideshowsByTag(tag, { limit: number, detailed: 0 }, function(result) {
		    if(cb)cb(result);
		});
	},
	get_slides_by_group : function(group,cb){
		var ss = new slideshare('K4UCWZUD', 'yWROGQx3');
		ss.getSlideshowsByTitle(group, { limit: 5, detailed: 0 }, function(result) {
		    if(cb)cb(result);
		});
	}
}
