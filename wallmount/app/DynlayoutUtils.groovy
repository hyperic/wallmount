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

/**
 * Utility methods for dynamic layout templates.
 */
class DynlayoutUtils {
    
    def static addDimensions(builder, x, y, width, height) {
        builder.x = x
        builder.y = y
        builder.w = width
        builder.h = height
    }

    def static addSize(builder, width, height) {
        builder.w = width
        builder.h = height
    }

    //{"name":"test1","theme":"Basic","w":900,"h":700,
    //"items":[{"w":292,"h":396,"y":73,"x":120,"title":"New Window",
    //"type":"multi",
    //"items":[{"size":80,"color":"green","titlePosition":"top",
    //"title":"my-custom-plat","eid":"1:10607",
    //"legends":[],"supportLegends":false,
    //"type":"hyperic.widget.AvailIcon"}]}]}
    
    def static addAvailIcon(builder, plat) {
        builder.eid = plat['eid']
        builder.name = plat['name']
    }
    
}