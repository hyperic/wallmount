import org.hyperic.hq.context.Bootstrap;
import org.hyperic.hq.hqu.rendit.BaseController

import java.awt.RenderingHints;
import java.awt.Transparency;
import java.awt.image.BufferedImage;
import java.awt.Graphics2D;
import javax.imageio.ImageIO;
import java.awt.image.WritableRaster
import java.awt.image.DataBufferByte

import java.io.ByteArrayOutputStream

import org.apache.commons.logging.Log
import org.apache.commons.logging.LogFactory


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
 */
class ImageController extends BaseController {
    
    Log log = LogFactory.getLog(this.getClass())
    
    private static BASE_IMAGE_PATH = "hqu/wallmount/public/images/"
    private static IMAGE_ELLIPSE_BG_GREEN = BASE_IMAGE_PATH + "ok-ellipse.png"
    
    /**
     * Overwriting BaseController render method to
     * handle images. 
     */
    protected void render(opts) {
        // TODO: move code to BaseController
        
    }
    
    /**
     * Writes image to response.
     */
    protected void renderImage(bytes) {		
        invokeArgs.response.setContentType('image/png')
        def outStream = invokeArgs.response.outputStream
        new OutputStreamWriter(outStream, "UTF-8")
        outStream.write(bytes, 0, bytes.length)
        outStream.flush()
    }
    
    /**
     * 
     */
    def getScaledImage(params) {
        //		def img = params.getOne('img')
        //		def w = params.getOne('w').toInteger()
        //		def h = params.getOne('h').toInteger()
        
        
        
        def imgPath = IMAGE_ELLIPSE_BG_GREEN
        
        BufferedImage originalImage = ImageIO.read(Bootstrap.getResource(imgPath).getFile());
        
        BufferedImage scaledImage = getScaledInstance(originalImage, 100, 100, RenderingHints.VALUE_INTERPOLATION_NEAREST_NEIGHBOR, false)
        
        byte[] data = imageByteData(scaledImage) 
        
        
        renderImage(data)
        
    }
    
    /**
     * 
     */
    private byte[] getImageData(path) {
        def file = Bootstrap.getResource(path).getFile();
        return file.readBytes()
    }
    
    
    public static BufferedImage getScaledInstance(BufferedImage img,
    int targetWidth,
    int targetHeight,
    Object hint,
    boolean higherQuality) {
        
        int type = (img.getTransparency() == Transparency.OPAQUE) ?
                BufferedImage.TYPE_INT_RGB : BufferedImage.TYPE_INT_ARGB;
        BufferedImage ret = (BufferedImage)img;
        int w, h;
        if (higherQuality) {
            // Use multi-step technique: start with original size, then
            // scale down in multiple passes with drawImage()
            // until the target size is reached
            w = img.getWidth();
            h = img.getHeight();
        } else {
            // Use one-step technique: scale directly from original
            // size to target size with a single drawImage() call
            w = targetWidth;
            h = targetHeight;
        }
        
        BufferedImage tmp = new BufferedImage(w, h, type);
        Graphics2D g2 = tmp.createGraphics();
        g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, hint);
        g2.drawImage(ret, 0, 0, w, h, null);
        g2.dispose();
        ret = tmp;
        
        //		while (w != targetWidth || h != targetHeight) {
        //			if (higherQuality && w > targetWidth) {
        //				w /= 2;
        //				if (w < targetWidth) {
        //					w = targetWidth;
        //				}
        //			}
        //
        //			if (higherQuality && h > targetHeight) {
        //				h /= 2;
        //				if (h < targetHeight) {
        //					h = targetHeight;
        //				}
        //			}
        //
        //			BufferedImage tmp = new BufferedImage(w, h, type);
        //			Graphics2D g2 = tmp.createGraphics();
        //			g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, hint);
        //			g2.drawImage(ret, 0, 0, w, h, null);
        //			g2.dispose();
        //
        //			ret = tmp;
        //		} 
        
        return ret;
    }

    /**
     * returns byte array from BufferedImage.    
     */
    private byte[] imageByteData(BufferedImage image) {
        ByteArrayOutputStream out = new ByteArrayOutputStream()
        ImageIO.write(image, "png", out)
        out.flush()
        byte[] bytes = out.toByteArray()
        out.close()
        return bytes
    }
}