var api = {
	s4 : function(){
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	},
	guid : function(){
		return api.s4() + api.s4() + '-' + api.s4() + '-' + api.s4() + '-' + api.s4() + '-' + api.s4() + api.s4() + api.s4()
	},
	getDate : function(){
	 var now = new Date();
	 return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()
	},
  	getCadre : function(links,elements,offset){
    	var left_min = 10000000000000000000000;
      	var left_max = 0;
      	var top_min = 10000000000000000000000;
      	var top_max = 0;
      	// on prend le cadre
      	elements.forEach(function(el){
          	if(api.isVisible(links,global.collections.Elements,el)){
              	if(el.get('left') < left_min) left_min = el.get('left')
              	if((el.get('left') + $('#'+el.get('id')).width()+offset) > left_max) left_max = el.get('left') + $('#'+el.get('id')).width() + offset;
              	if(el.get('top') < top_min) top_min = el.get('top')
              	if((el.get('top') + $('#'+el.get('id')).height()+offset) > top_max) top_max = el.get('top') + $('#'+el.get('id')).height() + offset;
          	}            
      	});
      	// on definit la hauteur + largeur du cadre
      	var cadre_width = left_max - left_min;
      	var cadre_height = top_max - top_min;
      	return {width:cadre_width,height:cadre_height,left_min:left_min,left_max:left_max,top_min:top_min,top_max:top_max};
  	},
}