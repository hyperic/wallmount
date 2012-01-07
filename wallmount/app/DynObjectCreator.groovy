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
 * Methods in this class are meant to be used to build needed
 * parameters to represent a widget.
 */
class DynObjectCreator {
    
    /**
     * Creates necessary fields for a widget.
     * 
     * widget
     * 
     * @param map 
     *  
     * @return 
     */
    def static getWidget(map) {
        if(map.widget == "hyperic.widget.label.Label")
            getLabel(map)
        else if(map.widget == "hyperic.widget.AvailIcon")
            getAvailIcon(map)
        else if(map.widget == "hyperic.widget.Spinner")
            getSpinner(map)
        else if(map.widget == "hyperic.widget.EllipseLabel")
            getEllipseLabel(map)
        else if(map.widget == "hyperic.widget.HorizontalArrowPipe")
            getHorizontalArrowPipe(map)
    }
    
    /**
     * 
     */
    def static getLabel(map) {
        // Override defaults with given map values
        StatUtil.defsLabel + map
    }

    /**
     * 
     */
    def static getAvailIcon(map) {
        // Override defaults with given map values
        StatUtil.defsAvailIcon + map
    }

    /**
     * 
     */
    def static getSpinner(map) {
        // Override defaults with given map values
        StatUtil.defsSpinner + map
    }

    /**
     * 
     */
    def static getEllipseLabel(map) {
        // Override defaults with given map values
        StatUtil.defsEllipseLabel + map
    }

    /**
     * 
     */
    def static getHorizontalArrowPipe(map) {
        // Override defaults with given map values
        StatUtil.defsHorizontalArrowPipe + map
    }

    /**
     * 
     */
    def static getChart(map) {
        // Override defaults with given map values
        StatUtil.defsChart + map
    }
    
}