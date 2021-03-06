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

dojo.provide("hyperic.data.ResourceTree");

dojo.require("dijit.Tree");
dojo.require("dijit.tree.dndSource");

dojo.declare("hyperic.data.ResourceTree", dijit.Tree, {

    checkAcceptance: function(source, nodes){
    	// We don't want to dnd inside the tree.
    	return false;
    },

    getIconClass: function(/*dojo.data.Item*/ item, /*Boolean*/ opened){
    	// define tree icons
    	
        if(item.eid){
           if(item.eid.indexOf("1:") === 0)
               return "hypericIconPlatform";        	
           if(item.eid.indexOf("2:") === 0)
               return "hypericIconServer";            
           if(item.eid.indexOf("3:") === 0)
               return "hypericIconService";            
           if(item.eid.indexOf("5:") === 0)
               return "hypericIconGroup";            
        }

        if(item.pid){
            if(item.pid.indexOf("1:") === 0)
                return "hypericIconPlatformType";        	
            if(item.pid.indexOf("2:") === 0)
                return "hypericIconServerType";            
            if(item.pid.indexOf("3:") === 0)
                return "hypericIconServiceType";            
        }

        if(item.mid){
        	return "hypericIconMetric";
        }    	

        if(item.track){
        	return "hypericIconMetric";
        }    	

        return (!item || this.model.mayHaveChildren(item)) ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "dijitLeaf"
    }

});