dojo.provide("hyperic.data.TreeDndSource");

dojo.require("dijit.tree.dndSource");

dojo.declare("hyperic.data.TreeDndSource", dijit.tree.dndSource, {
	
	copyOnly:true,
	
    onMouseMove: function(e){
    	// overwrite parents onMouseMove to explicitely check
    	// whether node should be dragged.
    	// For now, just enable dnd if node is a metric.
        if(this.isDragging && this.targetState == "Disabled"){ return; }
       	if(this.mouseDown) {
            var _nodes = this.anchor;               //get the dragged tree row's div
            var _id = _nodes.id;                    //get the id of the dragged div
            var dragDndItem = this.getItem(_id);    //get the dnd item for the dragged div
            var dragTreeNode = dragDndItem.data;    //get the treenode of the dragged div
            var dragItem = dragTreeNode.item;       //get the store item bound to the dragged treenode
            if(dragItem.mid || dragItem.eid){
                this.inherited(arguments);
            }
        }        	
    }
	
	
});