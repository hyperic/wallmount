import org.hyperic.hq.hqu.rendit.HQUPlugin

import WmvisualizerController
import ImageController

class Plugin extends HQUPlugin {
	Plugin() {
        addMastheadView(true, '/wmvisualizer/index.hqu', 'Wall Mount Visualizer', 'tracker')
    }         
}

