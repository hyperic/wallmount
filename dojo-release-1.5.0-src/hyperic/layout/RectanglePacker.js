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
dojo.provide("hyperic.layout.RectanglePacker");

dojo.declare("hyperic.layout.RectanglePacker",
    null, {
    // summary:
	//     Class to implement bin packing algorithm to organise
	//     and scale window positions automatically.
	// 
	// credits:
	//     <http://www.blackpawn.com/texts/lightmaps/default.html>
	//     <http://pollinimini.net/blog/rectangle-packing-2d-packing>

    constructor: function(width, height){
        this.root = {};
        this.reset( width, height );
    },

    reset: function(width, height){
        this.root.x = 0;
        this.root.y = 0;
        this.root.w = width;
        this.root.h = height;
        delete this.root.left;
        delete this.root.right;

        this.reservedWidth = 0;
        this.reservedHeight = 0;
    },

    rawpack: function(/*Array*/blocks, sortfunc, xField, yField, wField, hField){
        // summary:
        //     Tries to pack given blocks to fit into existing dimensions.
    	//
        // description:
        //     Packs given blocks to reserved canvas size. This method doesn't
    	//     unsure successful packing. Fitted and non-fitted objects
    	//     are returned separately in different arrays.

        var _x = xField || 'x';
        var _y = yField || 'y';
        var _w = wField || 'w';
        var _h = hField || 'h';

        var clone = dojo.clone(blocks);
        //this.reset();
        var fit = [];
        var nofit = [];
        for (var i=0; i<clone.length; i++) {
            var coords = this.find(clone[i][_w], clone[i][_h]);
            if (coords) {
                fit.push();
                clone[i][_x] = coords.x;
                clone[i][_y] = coords.y;
                fit.push(clone[i]);
            } else {
                nofit.push(clone[i]);
            } 			
        }
        return {fit: fit, nofit: nofit};
    },

    scalepack: function(/*Array*/blocks, sortfunc, xField, yField, wField, hField){
        // summary:
        //     Scales blocks to find optimal pack combination to fit blocks.
        //
        // description:
        //     This method will try to rescale object to find optimal
        //     pack combination. Instead of rawpack method, this won't fail
        //     to pack all blocks.
        //     In case block pack fails, total canvas area is increased until
        //     all blocks are fitted. If first attempt to pack succeeds, canvas
        //     area is decreased until optimal size if found.
        //     When optimal pack is found, blocks are rescaled to match orinigal
        //     canvas aspect ratio.

        var _x = xField || 'x';
        var _y = yField || 'y';
        var _w = wField || 'w';
        var _h = hField || 'h';
        
        // need original dimensions, we use these
        // 
        var origWidth = this.root.w;
        var origHeight = this.root.h;
        var origRatio = this.root.w / this.root.h;
        var lastHeight = origHeight;

        // do first pack attempt
        var last = this.rawpack(blocks, sortfunc, xField, yField, wField, hField);
        var scaleUp = (last.nofit.length == 0);

        // do max 10 packs to find optimal ratio
        for (var i=0; i<20; i++) {
            if(scaleUp) {
            	// fit all, scale up to find better pack
            	this.reset(this.root.w-(this.root.w/10), this.root.h-(this.root.h/10));
                var ret = this.rawpack(blocks, sortfunc, xField, yField, wField, hField);
                if(ret.nofit.length == 0) {
                	last = ret;
                	lastHeight = this.root.h;
                } else {
                	break;
                }
            } else {
            	// missed some blocks, scale down
            	this.reset(this.root.w+(this.root.w/10), this.root.h+(this.root.h/10));
                var ret = this.rawpack(blocks, sortfunc, xField, yField, wField, hField);
            	lastHeight = this.root.h;
            	last = ret;
                if(ret.nofit.length == 0) {
                	break;
                }            	
            }
        	
        }

        var ratio = origHeight / lastHeight;
        for (var i=0; i<last.fit.length; i++) {
        	last.fit[i][_x] = last.fit[i][_x] * ratio; 
        	last.fit[i][_y] = last.fit[i][_y] * ratio; 
        	last.fit[i][_w] = last.fit[i][_w] * ratio; 
        	last.fit[i][_h] = last.fit[i][_h] * ratio; 
        }

        return last;
    },

    getDimensions: function(){
        return { w: this.reservedWidth, h: this.reservedHeight };
    },

    find: function(w, h){
        var coords = this._recursive( this.root, w, h );
        if (coords) {
            if ( this.reservedWidth < coords.x + w )
                this.reservedWidth = coords.x + w;
            if ( this.reservedHeight < coords.y + h )
                this.reservedHeight = coords.y + h;
        }
        return coords;
    },

    _recursive: function(node, w, h){
        if (node.left) {
            var coords = this._recursive(node.left, w, h);
            return coords ? coords : this._recursive(node.right, w, h);	
        } else {
            if (node.used || w > node.w || h > node.h)
                return null;

            if (w == node.w && h == node.h) {
                node.used = true;
                return {x: node.x, y: node.y};
            }

            node.left = this._cloneNode(node);
            node.right = this._cloneNode(node);

            if (node.w - w > node.h - h) {
                node.left.w = w;
                node.right.x = node.x + w;
                node.right.w = node.w - w;	
            } else {
                node.left.h = h;
                node.right.y = node.y + h;
                node.right.h = node.h - h;							
            }

            return this._recursive(node.left, w, h);
        }

    },

    _cloneNode: function(node) {
        return {
            x: node.x,
            y: node.y,
            w: node.w,
            h: node.h};
    }


});