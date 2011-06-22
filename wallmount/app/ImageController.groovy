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

import org.hyperic.hq.context.Bootstrap;

import java.awt.RenderingHints;
import java.awt.Transparency;
import java.awt.image.BufferedImage;
import java.awt.Graphics2D;
import javax.imageio.ImageIO;
import java.awt.image.WritableRaster
import java.awt.image.DataBufferByte

import java.io.ByteArrayOutputStream


/**
 * This class handles server side image scaling operations.
 * 
 * Usage of server side scaling is done to remove
 * image operations away from browser dom rendering tree. If dom
 * tree contains components with animation it results redraw
 * through the whole rendering tree. If browser scales the image
 * itselves, it's most of the time rescaled over and over again.
 * 
 * To have a already scaled image will
 * radically boost performance in cases where multiple images and
 * sizes are used.
 * 
 * Image which is scaled on server has to exist on plugin's public
 * material. All PNG images under path /hqu/wmvisualizer/public/...
 * 
 */
class ImageController extends BaseWallmountController {
        
    private static BASE_IMAGE_PATH = "hqu/wmvisualizer/public/"
    private static IMAGE_ELLIPSE_BG_GREEN = BASE_IMAGE_PATH + "js/hyperic/widget/avail/resources/ok-ellipse.png"
        
    /**
     * Returns modified image.
     * 
     * path - relative path to image from BASE_IMAGE_PATH
     * w - scale to given width
     * h - scale to given height
     * 
     * If w and h is not given, origin image size is used.
     * If only w is given, aspect ratio is preserved and height calculated from given width.
     * If only h is given, aspect ratio is preserved and width calculated from given height.
     */
    def getScaledImage(params) {
        
        def path = params.getOne('path')
        def w = params.getOne('w', '0') as int
        def h = params.getOne('h', '0') as int
        
        def imgPath = BASE_IMAGE_PATH + path
        def imageFile = getImageFile(imgPath);

        setRendered(true)
        
        if((w < 1 && h < 1) || imageFile == null) {
            sendError()
            return
        }
        
        BufferedImage originalImage = ImageIO.read(imageFile);
        
        def ratio = originalImage.width / originalImage.height 
        
        if(w < 1) {
            w = (h * ratio) as int
        } else if(h < 1) {
            h = (w / ratio) as int
        }
               
        BufferedImage scaledImage = getScaledInstance(originalImage, w, h, RenderingHints.VALUE_INTERPOLATION_NEAREST_NEIGHBOR)
        byte[] data = imageByteData(scaledImage)         
        
        renderImage(data)
    }

    /**
     * Gets image File instance.    
     */
    private File getImageFile(String path) {
        def fileResource = Bootstrap.getResource(path)
        if(fileResource.exists()) {
            return fileResource.file;
        } else {
            return null;
        }
        
    }
    
    /**
     * Scaling the image.
     */
    private BufferedImage getScaledInstance(BufferedImage image,
                                            int width, int height,
                                            Object hint) {
        
        int type = (image.getTransparency() == Transparency.OPAQUE) ?
                BufferedImage.TYPE_INT_RGB : BufferedImage.TYPE_INT_ARGB;
        BufferedImage bufImage = (BufferedImage)image;
        int w, h;
        
        w = width;
        h = height;
            
        BufferedImage tmp = new BufferedImage(w, h, type);
        Graphics2D g2 = tmp.createGraphics();
        g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, hint);
        g2.drawImage(bufImage, 0, 0, w, h, null);
        g2.dispose();
        bufImage = tmp;            
        
        return bufImage;
    }

    /**
     * Renders image data to output stream.                                        
     */
    private void renderImage(bytes) {
        invokeArgs.response.setContentType('image/png')
        def outStream = invokeArgs.response.outputStream
        new OutputStreamWriter(outStream, "UTF-8")
                               outStream.write(bytes, 0, bytes.length)
                               outStream.flush()
    }

                                            
    /**
     * returns byte array from BufferedImage.
     * 
     * @param image Instance of BufferedImage
     * @return byte array of raw image data
     */
    private byte[] imageByteData(BufferedImage image) {
        ByteArrayOutputStream tempOut = new ByteArrayOutputStream()
        ImageIO.write(image, "png", tempOut)
        tempOut.flush()
        byte[] bytes = tempOut.toByteArray()
        tempOut.close()
        bytes
    }
}