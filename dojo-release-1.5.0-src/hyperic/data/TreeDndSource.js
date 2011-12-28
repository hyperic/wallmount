/**
 * NOTE: This copyright does *not* cover user programs that use HQ
 * program services by normal system calls through the application
 * program interfaces provided as part of the Hyperic Plug-in Development
 * Kit or the Hyperic Client Development Kit - this is merely considered
 * normal use of the program, and does *not* fall under the heading of
 *  "derived work".
 *
 *  Copyright (C) [2011], VMware, Inc.
 *  This file is part of HQ.
 *
 *  HQ is free software; you can redistribute it and/or modify
 *  it under the terms version 2 of the GNU General Public License as
 *  published by the Free Software Foundation. This program is distributed
 *  in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 *  even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 *  PARTICULAR PURPOSE. See the GNU General Public License for more
 *  details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 *  USA.
 *
 */

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
            
            // define which nodes become dnd items
            if(dragItem.mid || dragItem.eid || dragItem.track || dragItem.pid){
                this.inherited(arguments);
            }
        }        	
    }
	
	
});