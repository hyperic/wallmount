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

dojo.provide("hyperic.dialog.TableWindowDialog");

dojo.require("dijit.Dialog");
dojo.require("hyperic.wallmount.WindowUtil");
dojo.require("dijit.form.NumberSpinner");

dojo.declare("hyperic.dialog.TableWindowDialog",
    [dijit.Dialog],{
        
    _grid: null,
    _store: null,
    
    layoutsUrl: '',
    
    templateString: dojo.cache("hyperic.dialog", "resources/TableWindowDialog.html"),

    postCreate: function(){
        dojo.connect(dijit.byId("twCancelDialogButton"), "onClick", dojo.hitch(this, "hide"));    	
        dojo.connect(dijit.byId("twOkDialogButton"), "onClick", dojo.hitch(this, "_requestWindow"));
        this.inherited(arguments);
    },
    
    _requestWindow: function(){
        var rows = dijit.byId(this.tw_rows).get('value');
        var cols = dijit.byId(this.tw_cols).get('value');
        
        hyperic.wallmount.WindowUtil.newTableWindow({rows:rows,cols:cols});
    }
        
});