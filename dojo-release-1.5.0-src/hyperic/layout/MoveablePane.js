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

dojo.provide("hyperic.layout.MoveablePane");

dojo.require("dijit._Templated");
dojo.require("dojox.layout.ContentPane");
dojo.require("dojo.dnd.Moveable");

dojo.declare("hyperic.layout.MoveablePane", 
    [ dojox.layout.ContentPane, dijit._Templated ],
    {
    	
    contentClass: "hypericMoveablePaneContent",
    
    templateString: dojo.cache("hyperic.layout","resources/MoveablePane.html"),
    	
    postCreate: function(){
    	this.inherited(arguments);
    	new dojo.dnd.move.parentConstrainedMoveable(this.domNode, {area: "border", within: true, handle: this.domNode});
    },
    
    close: function(){
        dojo.publish("globalEvents", ["closing MoveablePane"]);
        this.hide(dojo.hitch(this,function(){
            this.destroyRecursive();
        })); 
    },
    
    hide: function(/* Function? */ callback){
        // summary: Close, but do not destroy this FloatingPane
        dojo.fadeOut({
            node:this.domNode,
            duration:400,
            onEnd: dojo.hitch(this,function() { 
                this.domNode.style.display = "none";
                this.domNode.style.visibility = "hidden"; 
                if(callback){
                    callback();
                }
            })
        }).play();
    }
});