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

dojo.provide("hyperic.widget.base.ValueMixin");

dojo.declare("hyperic.widget.base.ValueMixin", null,{

    // value: Number
    // Main metric value attached to this component. Value is always
    // the last raw metric.
    value: null,

    setValue: function(value) {
    	// summary:
    	//     Setting value and handling value state.
    	
    	// when value is explicitly set through this
    	// method we also assume state to be ok unless given
    	// value is undefined or null.
    	if((typeof(value) === 'undefined') || value == null) {
    		this.value = null;
        	this.valueState = 1;    		
    	} else {
        	this.value = value;
        	this.valueState = 0;    		
    	}
    }
        

});
