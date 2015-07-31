var api = {
	/////////////////////////////
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
  isVisible : function(links,elements,model){
    var visibility = true;
    var parents = api.getTreeParentNodes(model,elements,[]);
    parents.forEach(function(p){
      if(p.get('visibility') == false){
        visibility = false;
      }
    })
    return visibility;
  },
  getTreeParentNodes : function(currentNode,tree,alreadyDone){
    // tree have to be a collection of node/model with each an id_father attribute reference to a node father
    // node have to be a model with an id_father attribute reference to a node father
    var parents = [];
    var parents_id = [];
    if(alreadyDone) parents_id = alreadyDone;
    if(currentNode.get('id_father')){
      tree.each(function(node){
        if(_.indexOf(parents_id, node.get('id')) == -1){
          //console.log("current node ",currentNode.get('id_father')," - node ",node.get('id'))
          if(currentNode.get('id_father') == node.get('id')){
            parents.unshift(node);
            parents_id.unshift(node.get('id'));
            currentNode = node
            parents = _.union(parents, api.getTreeParentNodes(currentNode,tree,parents_id))
          }  
        }
      });
    }
    
    // return all parent nodes from a branch node
    return parents;
  },

}